-- Drop existing types if they exist
DROP TYPE IF EXISTS promotion_type CASCADE;
DROP TYPE IF EXISTS promotion_status CASCADE;
DROP TYPE IF EXISTS promotion_target_type CASCADE;

-- Create promotion types
CREATE TYPE promotion_type AS ENUM (
    'percentage',
    'fixed_amount',
    'buy_x_get_y',
    'free_shipping',
    'tier_discount'
);

CREATE TYPE promotion_status AS ENUM (
    'draft',
    'active',
    'scheduled',
    'expired',
    'cancelled'
);

CREATE TYPE promotion_target_type AS ENUM (
    'all',
    'product',
    'category',
    'collection',
    'customer_segment'
);

-- Drop existing tables if they exist
DROP TABLE IF EXISTS promotion_bxgy_rules CASCADE;
DROP TABLE IF EXISTS promotion_tiers CASCADE;
DROP TABLE IF EXISTS promotion_usage CASCADE;
DROP TABLE IF EXISTS promotion_targets CASCADE;
DROP TABLE IF EXISTS promotions CASCADE;

-- Create promotions table
CREATE TABLE promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE,
    description TEXT,
    type promotion_type NOT NULL,
    value DECIMAL(10,2),
    min_purchase_amount DECIMAL(10,2),
    max_discount_amount DECIMAL(10,2),
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ends_at TIMESTAMP WITH TIME ZONE,
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    status promotion_status NOT NULL DEFAULT 'draft',
    is_stackable BOOLEAN DEFAULT false,
    priority INTEGER DEFAULT 0,
    conditions JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_value CHECK (
        (type = 'percentage' AND value >= 0 AND value <= 100) OR
        (type IN ('fixed_amount', 'free_shipping') AND (value IS NULL OR value >= 0)) OR
        (type IN ('buy_x_get_y', 'tier_discount') AND value IS NULL)
    ),
    CONSTRAINT valid_amounts CHECK (
        (min_purchase_amount IS NULL OR min_purchase_amount >= 0) AND
        (max_discount_amount IS NULL OR max_discount_amount >= 0)
    )
);

-- Create promotion targets table
CREATE TABLE promotion_targets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
    target_type promotion_target_type NOT NULL,
    target_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create promotion usage table
CREATE TABLE promotion_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    discount_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT positive_discount CHECK (discount_amount >= 0)
);

-- Create promotion tiers table
CREATE TABLE promotion_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
    min_quantity INTEGER NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT positive_quantity CHECK (min_quantity > 0),
    CONSTRAINT positive_discount_value CHECK (discount_value >= 0)
);

-- Create buy_x_get_y rules table
CREATE TABLE promotion_bxgy_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
    buy_quantity INTEGER NOT NULL,
    get_quantity INTEGER NOT NULL,
    buy_product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    get_product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    discount_percentage INTEGER NOT NULL DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT positive_quantities CHECK (
        buy_quantity > 0 AND 
        get_quantity > 0
    ),
    CONSTRAINT valid_discount_percentage CHECK (
        discount_percentage >= 0 AND 
        discount_percentage <= 100
    )
);

-- Create function to validate promotion stacking
CREATE OR REPLACE FUNCTION validate_promotion_stacking()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_stackable = false THEN
        IF EXISTS (
            SELECT 1 FROM promotions
            WHERE id != NEW.id
            AND is_stackable = false
            AND status = 'active'
            AND (
                (NEW.starts_at BETWEEN starts_at AND COALESCE(ends_at, 'infinity'::timestamp))
                OR (COALESCE(NEW.ends_at, 'infinity'::timestamp) BETWEEN starts_at AND COALESCE(ends_at, 'infinity'::timestamp))
            )
        ) THEN
            RAISE EXCEPTION 'Cannot create non-stackable promotion that overlaps with existing non-stackable promotions';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to validate promotion type rules
CREATE OR REPLACE FUNCTION validate_promotion_type_rules()
RETURNS TRIGGER AS $$
BEGIN
    -- Validate buy_x_get_y rules
    IF NEW.type = 'buy_x_get_y' THEN
        IF NOT EXISTS (
            SELECT 1 FROM promotion_bxgy_rules
            WHERE promotion_id = NEW.id
        ) THEN
            RAISE EXCEPTION 'Buy X Get Y promotions must have at least one rule';
        END IF;
    END IF;

    -- Validate tier_discount rules
    IF NEW.type = 'tier_discount' THEN
        IF NOT EXISTS (
            SELECT 1 FROM promotion_tiers
            WHERE promotion_id = NEW.id
        ) THEN
            RAISE EXCEPTION 'Tier discount promotions must have at least one tier';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to update promotion status
CREATE OR REPLACE FUNCTION update_promotion_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Update status based on dates
    IF NEW.status = 'active' OR NEW.status = 'scheduled' THEN
        IF CURRENT_TIMESTAMP < NEW.starts_at THEN
            NEW.status := 'scheduled';
        ELSIF CURRENT_TIMESTAMP > COALESCE(NEW.ends_at, 'infinity'::timestamp) THEN
            NEW.status := 'expired';
        ELSE
            NEW.status := 'active';
        END IF;
    END IF;

    -- Update status if usage limit is reached
    IF NEW.usage_limit IS NOT NULL AND NEW.used_count >= NEW.usage_limit THEN
        NEW.status := 'expired';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER validate_promotion_stacking_trigger
    BEFORE INSERT OR UPDATE ON promotions
    FOR EACH ROW
    EXECUTE FUNCTION validate_promotion_stacking();

CREATE TRIGGER validate_promotion_type_rules_trigger
    BEFORE UPDATE OF status ON promotions
    FOR EACH ROW
    WHEN (NEW.status = 'active')
    EXECUTE FUNCTION validate_promotion_type_rules();

CREATE TRIGGER update_promotion_status_trigger
    BEFORE INSERT OR UPDATE ON promotions
    FOR EACH ROW
    EXECUTE FUNCTION update_promotion_status();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_promotions_code ON promotions(code);
CREATE INDEX IF NOT EXISTS idx_promotions_status ON promotions(status);
CREATE INDEX IF NOT EXISTS idx_promotions_type ON promotions(type);
CREATE INDEX IF NOT EXISTS idx_promotions_date_range ON promotions(starts_at, ends_at);
CREATE INDEX IF NOT EXISTS idx_promotion_usage_customer ON promotion_usage(customer_id, promotion_id);
CREATE INDEX IF NOT EXISTS idx_promotion_usage_order ON promotion_usage(order_id);
CREATE INDEX IF NOT EXISTS idx_promotion_targets_composite ON promotion_targets(promotion_id, target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_promotion_bxgy_products ON promotion_bxgy_rules(buy_product_id, get_product_id); 