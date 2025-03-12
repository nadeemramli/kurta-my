-- Add compare_at_price to product_variants
ALTER TABLE product_variants
ADD COLUMN IF NOT EXISTS compare_at_price DECIMAL(10,2);

-- Update existing variants to have the same compare_at_price as their products if set
UPDATE product_variants pv
SET compare_at_price = p.compare_at_price
FROM products p
WHERE pv.product_id = p.id
AND p.compare_at_price IS NOT NULL;