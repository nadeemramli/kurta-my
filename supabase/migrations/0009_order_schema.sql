-- Create order status enum
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM (
        'draft',
        'pending',
        'processing',
        'completed',
        'cancelled',
        'returned',
        'refunded',
        'on_hold'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create payment status enum
DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM (
        'pending',
        'processing',
        'completed',
        'failed',
        'refunded'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create payment method enum
DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM (
        'cod',
        'online'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS order_history CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;

-- Create orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id),
    status order_status NOT NULL DEFAULT 'pending',
    payment_status payment_status NOT NULL DEFAULT 'pending',
    payment_method payment_method NOT NULL DEFAULT 'cod',
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    subtotal_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    shipping_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    shipping_address JSONB NOT NULL DEFAULT '{}'::jsonb,
    billing_address JSONB NOT NULL DEFAULT '{}'::jsonb,
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    ordered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create order items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    variant_id UUID REFERENCES product_variants(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create order history table for status changes
CREATE TABLE order_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status order_status NOT NULL,
    payment_status payment_status NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID -- Reference to admin user
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_dates ON orders(ordered_at, created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_history_order ON order_history(order_id);

-- Create function to validate order status transitions
CREATE OR REPLACE FUNCTION validate_order_status_transition()
RETURNS TRIGGER AS $$
BEGIN
    -- Prevent changes to completed orders unless moving to returned/refunded
    IF OLD.status = 'completed' AND NEW.status NOT IN ('returned', 'refunded') THEN
        RAISE EXCEPTION 'Cannot change status of completed order except to returned or refunded';
    END IF;

    -- Ensure payment status matches order status
    IF NEW.status = 'completed' AND NEW.payment_status != 'completed' THEN
        RAISE EXCEPTION 'Order cannot be completed without completed payment';
    END IF;

    -- Record status change in history
    INSERT INTO order_history (
        order_id,
        status,
        payment_status,
        notes
    ) VALUES (
        NEW.id,
        NEW.status,
        NEW.payment_status,
        'Status changed from ' || OLD.status || ' to ' || NEW.status
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate order totals
CREATE OR REPLACE FUNCTION calculate_order_totals()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate totals from order items
    WITH totals AS (
        SELECT 
            SUM(total_price) as subtotal
        FROM order_items
        WHERE order_id = NEW.id
    )
    UPDATE orders
    SET 
        subtotal_amount = COALESCE(totals.subtotal, 0),
        total_amount = COALESCE(totals.subtotal, 0) + shipping_amount + tax_amount - discount_amount
    FROM totals
    WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to validate payment method
CREATE OR REPLACE FUNCTION validate_payment_method()
RETURNS TRIGGER AS $$
BEGIN
    -- COD orders cannot be completed without delivery
    IF NEW.payment_method = 'cod' AND NEW.status = 'completed' AND 
       NOT EXISTS (
           SELECT 1 FROM order_history 
           WHERE order_id = NEW.id 
           AND status = 'processing'
       ) THEN
        RAISE EXCEPTION 'COD orders must go through processing before completion';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER validate_order_status_transition_trigger
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION validate_order_status_transition();

CREATE TRIGGER calculate_order_totals_trigger
    AFTER INSERT OR UPDATE OR DELETE ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION calculate_order_totals();

CREATE TRIGGER validate_payment_method_trigger
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION validate_payment_method(); 