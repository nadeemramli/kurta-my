-- Enhance products table with additional fields
ALTER TABLE products
ADD COLUMN IF NOT EXISTS media jsonb[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS weight numeric(10,2),
ADD COLUMN IF NOT EXISTS weight_unit text DEFAULT 'kg',
ADD COLUMN IF NOT EXISTS vendor text,
ADD COLUMN IF NOT EXISTS type text,
ADD COLUMN IF NOT EXISTS tags text[],
ADD COLUMN IF NOT EXISTS barcode text,
ADD COLUMN IF NOT EXISTS customs_info jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS seo_title text,
ADD COLUMN IF NOT EXISTS seo_description text,
ADD COLUMN IF NOT EXISTS track_quantity boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS continue_selling_when_out_of_stock boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_shipping boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS published_at timestamp with time zone;

-- Create product variants table
CREATE TABLE IF NOT EXISTS product_variants (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id uuid REFERENCES products(id) ON DELETE CASCADE,
    title text NOT NULL,
    sku text,
    barcode text,
    price numeric(10,2) NOT NULL,
    compare_at_price numeric(10,2),
    cost_price numeric(10,2),
    inventory_quantity integer DEFAULT 0,
    weight numeric(10,2),
    weight_unit text DEFAULT 'kg',
    option1_name text,
    option1_value text,
    option2_name text,
    option2_value text,
    option3_name text,
    option3_value text,
    media jsonb[] DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create product options table
CREATE TABLE IF NOT EXISTS product_options (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id uuid REFERENCES products(id) ON DELETE CASCADE,
    name text NOT NULL,
    values text[] NOT NULL,
    position integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create product collections table if not exists
CREATE TABLE IF NOT EXISTS product_collections (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    title text NOT NULL,
    description text,
    handle text UNIQUE,
    published boolean DEFAULT true,
    sort_order text DEFAULT 'manual',
    template_suffix text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create products_collections junction table
CREATE TABLE IF NOT EXISTS products_collections (
    product_id uuid REFERENCES products(id) ON DELETE CASCADE,
    collection_id uuid REFERENCES product_collections(id) ON DELETE CASCADE,
    position integer DEFAULT 0,
    PRIMARY KEY (product_id, collection_id)
);

-- Create function to generate SKU
CREATE OR REPLACE FUNCTION generate_sku(product_name text)
RETURNS text AS $$
DECLARE
    base_sku text;
    counter integer := 1;
    final_sku text;
BEGIN
    -- Create base SKU from first letters of each word in product name
    base_sku := upper(regexp_replace(
        string_agg(
            substr(word, 1, 1),
            ''
        ),
        '[^A-Z0-9]',
        '',
        'g'
    ))
    FROM regexp_split_to_table(product_name, '\s+') word;

    -- Ensure base SKU is at least 3 characters
    IF length(base_sku) < 3 THEN
        base_sku := rpad(base_sku, 3, 'X');
    END IF;

    -- Add random numbers until unique
    LOOP
        final_sku := base_sku || '-' || to_char(counter, 'FM0000');
        EXIT WHEN NOT EXISTS (
            SELECT 1 FROM products WHERE sku = final_sku
            UNION ALL
            SELECT 1 FROM product_variants WHERE sku = final_sku
        );
        counter := counter + 1;
    END LOOP;

    RETURN final_sku;
END;
$$ LANGUAGE plpgsql;

-- Create function to handle inventory updates
CREATE OR REPLACE FUNCTION update_product_inventory()
RETURNS trigger AS $$
BEGIN
    -- Update main product inventory based on variants
    IF TG_TABLE_NAME = 'product_variants' THEN
        UPDATE products
        SET inventory_quantity = (
            SELECT COALESCE(SUM(inventory_quantity), 0)
            FROM product_variants
            WHERE product_id = NEW.product_id
        )
        WHERE id = NEW.product_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for inventory updates
CREATE TRIGGER update_product_inventory_trigger
AFTER INSERT OR UPDATE OF inventory_quantity ON product_variants
FOR EACH ROW
EXECUTE FUNCTION update_product_inventory();

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_vendor ON products(vendor);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_published_at ON products(published_at);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_product_variants_barcode ON product_variants(barcode); 