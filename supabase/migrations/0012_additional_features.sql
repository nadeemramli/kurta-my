-- Product Reviews
CREATE TABLE product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT,
    status TEXT DEFAULT 'pending',
    is_verified_purchase BOOLEAN DEFAULT false,
    helpful_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Product Tags (junction table only since tags table already exists)
CREATE TABLE product_tags (
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, tag_id)
);

-- Wishlists
CREATE TABLE wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(customer_id, product_id)
);

-- Content Management
CREATE TABLE content_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL, -- 'banner', 'slider', 'menu', 'static_page'
    content JSONB NOT NULL,
    status TEXT DEFAULT 'draft',
    position INTEGER DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inventory Management
CREATE TABLE inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id),
    variant_id UUID REFERENCES product_variants(id),
    quantity INTEGER NOT NULL,
    type TEXT NOT NULL, -- 'received', 'shipped', 'adjusted', 'returned'
    reference_type TEXT, -- 'order', 'purchase', 'adjustment'
    reference_id UUID,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventory_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id),
    variant_id UUID REFERENCES product_variants(id),
    type TEXT NOT NULL, -- 'low_stock', 'out_of_stock', 'overstock'
    threshold INTEGER NOT NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address JSONB,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Marketing
CREATE TABLE email_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'active',
    source TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE abandoned_carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id),
    email TEXT,
    cart_data JSONB NOT NULL,
    recovery_status TEXT DEFAULT 'pending',
    recovered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id),
    recommended_product_id UUID NOT NULL REFERENCES products(id),
    type TEXT NOT NULL, -- 'similar', 'frequently_bought_together', 'custom'
    score DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, recommended_product_id)
);

-- Create indexes
CREATE INDEX idx_product_reviews_product ON product_reviews(product_id);
CREATE INDEX idx_product_reviews_customer ON product_reviews(customer_id);
CREATE INDEX idx_product_reviews_rating ON product_reviews(rating);
CREATE INDEX idx_wishlists_customer ON wishlists(customer_id);
CREATE INDEX idx_content_blocks_type ON content_blocks(type);
CREATE INDEX idx_content_blocks_status ON content_blocks(status);
CREATE INDEX idx_inventory_movements_product ON inventory_movements(product_id);
CREATE INDEX idx_inventory_movements_type ON inventory_movements(type);
CREATE INDEX idx_inventory_alerts_product ON inventory_alerts(product_id);
CREATE INDEX idx_abandoned_carts_customer ON abandoned_carts(customer_id);
CREATE INDEX idx_product_recommendations_product ON product_recommendations(product_id);

-- Add triggers for inventory alerts
CREATE OR REPLACE FUNCTION check_inventory_alerts()
RETURNS TRIGGER AS $$
BEGIN
    -- Check for low stock alerts
    INSERT INTO inventory_alerts (product_id, variant_id, type, threshold)
    SELECT 
        NEW.product_id,
        NEW.id,
        CASE 
            WHEN NEW.inventory_quantity = 0 THEN 'out_of_stock'
            WHEN NEW.inventory_quantity <= 10 THEN 'low_stock'
        END,
        10
    WHERE NEW.inventory_quantity <= 10
    ON CONFLICT (product_id, variant_id) DO UPDATE
    SET 
        type = CASE 
            WHEN NEW.inventory_quantity = 0 THEN 'out_of_stock'
            WHEN NEW.inventory_quantity <= 10 THEN 'low_stock'
        END,
        updated_at = CURRENT_TIMESTAMP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_inventory_alerts_trigger
    AFTER INSERT OR UPDATE OF inventory_quantity ON product_variants
    FOR EACH ROW
    EXECUTE FUNCTION check_inventory_alerts();

-- Add stored procedure for updating review helpfulness
CREATE OR REPLACE FUNCTION update_review_helpfulness(review_id UUID, increment BOOLEAN)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE product_reviews
    SET helpful_votes = CASE 
        WHEN increment THEN helpful_votes + 1
        ELSE GREATEST(0, helpful_votes - 1)
    END
    WHERE id = review_id;
END;
$$; 