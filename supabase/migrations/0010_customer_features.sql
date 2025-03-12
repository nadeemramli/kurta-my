-- Add customer metrics columns
ALTER TABLE customers
    ADD COLUMN IF NOT EXISTS orders_count INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS total_spent DECIMAL(10,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS average_order_value DECIMAL(10,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS first_order_date TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS last_order_date TIMESTAMP WITH TIME ZONE;

-- Create customer segments table
CREATE TABLE IF NOT EXISTS customer_segments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    criteria JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create customer segment memberships table
CREATE TABLE IF NOT EXISTS customer_segment_memberships (
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    segment_id UUID NOT NULL REFERENCES customer_segments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (customer_id, segment_id)
);

-- Create loyalty program table
CREATE TABLE IF NOT EXISTS loyalty_program (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    points_balance INTEGER DEFAULT 0,
    lifetime_points INTEGER DEFAULT 0,
    tier_level TEXT DEFAULT 'bronze',
    tier_progress INTEGER DEFAULT 0,
    last_points_earned_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(customer_id)
);

-- Create loyalty transactions table
CREATE TABLE IF NOT EXISTS loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    points_earned INTEGER,
    points_redeemed INTEGER,
    transaction_type TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create function to update customer metrics
CREATE OR REPLACE FUNCTION update_customer_metrics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update customer metrics when an order is completed
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.status = 'completed' THEN
        WITH customer_stats AS (
            SELECT
                customer_id,
                COUNT(*) as total_orders,
                SUM(total_amount) as total_spent,
                AVG(total_amount) as average_order_value,
                MAX(created_at) as last_order_date,
                MIN(created_at) as first_order_date
            FROM orders
            WHERE customer_id = NEW.customer_id
            AND status = 'completed'
            GROUP BY customer_id
        )
        UPDATE customers c
        SET
            orders_count = cs.total_orders,
            total_spent = cs.total_spent,
            average_order_value = cs.average_order_value,
            last_order_date = cs.last_order_date,
            first_order_date = cs.first_order_date,
            updated_at = NOW()
        FROM customer_stats cs
        WHERE c.id = cs.customer_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for customer metrics updates
CREATE TRIGGER order_update_customer_metrics
    AFTER INSERT OR UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_customer_metrics();

-- Create function to update loyalty points
CREATE OR REPLACE FUNCTION update_loyalty_points()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW.status = 'completed' AND OLD.status != 'completed')) THEN
        -- Calculate points (1 point per $1 spent)
        WITH points AS (
            INSERT INTO loyalty_transactions (
                customer_id,
                order_id,
                points_earned,
                transaction_type,
                description
            ) VALUES (
                NEW.customer_id,
                NEW.id,
                FLOOR(NEW.total_amount),
                'order_completion',
                'Points earned from order #' || NEW.id
            )
            RETURNING points_earned
        )
        UPDATE loyalty_program
        SET 
            points_balance = points_balance + (SELECT points_earned FROM points),
            lifetime_points = lifetime_points + (SELECT points_earned FROM points),
            last_points_earned_at = CURRENT_TIMESTAMP,
            tier_progress = tier_progress + (SELECT points_earned FROM points),
            updated_at = CURRENT_TIMESTAMP
        WHERE customer_id = NEW.customer_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for loyalty points updates
CREATE TRIGGER order_update_loyalty_points
    AFTER INSERT OR UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_loyalty_points();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_customer_segments_name ON customer_segments(name);
CREATE INDEX IF NOT EXISTS idx_loyalty_program_customer ON loyalty_program(customer_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_customer ON loyalty_transactions(customer_id); 