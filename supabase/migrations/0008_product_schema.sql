-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create collections table
CREATE TABLE IF NOT EXISTS collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create variant options table
CREATE TABLE IF NOT EXISTS variant_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    values TEXT[] NOT NULL,
    additional_costs JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create variant brackets table
CREATE TABLE IF NOT EXISTS variant_brackets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create variant bracket options table
CREATE TABLE IF NOT EXISTS variant_bracket_options (
    bracket_id UUID NOT NULL REFERENCES variant_brackets(id) ON DELETE CASCADE,
    option_id UUID NOT NULL REFERENCES variant_options(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (bracket_id, option_id)
);

-- Create variant status enum type
DO $$ BEGIN
    CREATE TYPE variant_status AS ENUM ('active', 'inactive', 'draft');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Drop existing product_variants table if it exists
DROP TABLE IF EXISTS product_variants CASCADE;

-- Create product variants table
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku TEXT UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    inventory_quantity INTEGER NOT NULL DEFAULT 0,
    attributes JSONB DEFAULT '{}'::jsonb,
    status variant_status DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create product collections table
CREATE TABLE IF NOT EXISTS product_collections (
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (product_id, collection_id)
);

-- Create product media table
CREATE TABLE IF NOT EXISTS product_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt TEXT,
    type TEXT DEFAULT 'image',
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add product fields
ALTER TABLE products
    ADD COLUMN IF NOT EXISTS title TEXT NOT NULL,
    ADD COLUMN IF NOT EXISTS name TEXT GENERATED ALWAYS AS (title) STORED, -- For frontend compatibility
    ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS compare_at_price DECIMAL(10,2),
    ADD COLUMN IF NOT EXISTS charge_tax BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS meta_fields JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS seo_title TEXT,
    ADD COLUMN IF NOT EXISTS seo_description TEXT,
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_collections_slug ON collections(slug);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_product_variants_status ON product_variants(status);
CREATE INDEX IF NOT EXISTS idx_product_media_product ON product_media(product_id, position);
CREATE INDEX IF NOT EXISTS idx_variant_brackets_product ON variant_brackets(product_id);

-- Add constraint to ensure variant attributes match bracket options
CREATE OR REPLACE FUNCTION validate_variant_attributes()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if all attribute keys exist in variant brackets
    IF NOT EXISTS (
        SELECT 1
        FROM variant_brackets vb
        JOIN variant_bracket_options vbo ON vbo.bracket_id = vb.id
        JOIN variant_options vo ON vo.id = vbo.option_id
        WHERE vb.product_id = NEW.product_id
        AND vo.name = ANY(ARRAY(SELECT jsonb_object_keys(NEW.attributes)))
    ) THEN
        RAISE EXCEPTION 'Variant attributes must match product variant options';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_variant_attributes_trigger
    BEFORE INSERT OR UPDATE ON product_variants
    FOR EACH ROW
    EXECUTE FUNCTION validate_variant_attributes(); 