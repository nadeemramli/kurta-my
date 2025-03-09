-- Step 1: Create collections table if it doesn't exist
CREATE TABLE IF NOT EXISTS collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Step 2: Create product_collections junction table if it doesn't exist
CREATE TABLE IF NOT EXISTS product_collections (
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, collection_id)
);

-- Step 3: Migrate data from categories to collections
INSERT INTO collections (id, title, slug, description, seo_title, seo_description, created_at, updated_at)
SELECT 
    id,
    title,
    slug,
    description,
    seo_title,
    seo_description,
    created_at,
    updated_at
FROM categories
ON CONFLICT (slug) DO NOTHING;

-- Step 4: Migrate product relationships
INSERT INTO product_collections (product_id, collection_id)
SELECT 
    product_id,
    category_id
FROM product_categories
ON CONFLICT (product_id, collection_id) DO NOTHING;

-- Step 5: Drop old tables (only after ensuring data is migrated)
DROP TABLE IF EXISTS product_categories;
DROP TABLE IF EXISTS categories;

-- Step 6: Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_collections_slug ON collections(slug);
CREATE INDEX IF NOT EXISTS idx_collections_title ON collections(title);

-- Step 7: Add trigger for updated_at timestamp
CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON collections
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

-- Step 8: Add collection-related functions
CREATE OR REPLACE FUNCTION get_collection_products(collection_id UUID)
RETURNS TABLE (
    product_id UUID,
    title TEXT,
    price DECIMAL,
    status product_status
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.price,
        p.status
    FROM products p
    JOIN product_collections pc ON pc.product_id = p.id
    WHERE pc.collection_id = get_collection_products.collection_id
    ORDER BY p.title;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_product_collections(product_id UUID)
RETURNS TABLE (
    collection_id UUID,
    title TEXT,
    slug TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.title,
        c.slug
    FROM collections c
    JOIN product_collections pc ON pc.collection_id = c.id
    WHERE pc.product_id = get_product_collections.product_id
    ORDER BY c.title;
END;
$$ LANGUAGE plpgsql; 