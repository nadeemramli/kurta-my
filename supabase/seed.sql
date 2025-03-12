-- Seed data for testing

-- Clear existing data
TRUNCATE collections, products, variant_options, variant_brackets, variant_bracket_options, product_variants, product_collections, order_analytics, conversion_metrics CASCADE;

-- Insert test collections
INSERT INTO collections (id, title, slug, description) VALUES
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Men', 'men', 'Men''s clothing'),
('d290f1ee-6c54-4b01-90e6-d701748f0852', 'Women', 'women', 'Women''s clothing'),
('d290f1ee-6c54-4b01-90e6-d701748f0853', 'Kids', 'kids', 'Kids'' clothing');

-- Insert test products
INSERT INTO products (
    id, 
    title,
    slug,
    description, 
    price,
    compare_at_price,
    status,
    meta_fields,
    cost_per_item,
    sku,
    inventory_quantity
) VALUES
(
    'd290f1ee-6c54-4b01-90e6-d701748f0854',
    'Classic Black Kurta',
    'classic-black-kurta',
    'A timeless black kurta for men',
    89.99,
    NULL,
    'active',
    jsonb_build_object(
        'tags', array['men', 'kurta', 'black'],
        'slug', 'classic-black-kurta'
    ),
    45.00,
    'KRT-BLK-001',
    100
),
(
    'd290f1ee-6c54-4b01-90e6-d701748f0855',
    'Embroidered White Kurta',
    'embroidered-white-kurta',
    'Elegant white kurta with traditional embroidery',
    129.99,
    149.99,
    'active',
    jsonb_build_object(
        'tags', array['men', 'kurta', 'white', 'embroidered'],
        'slug', 'embroidered-white-kurta'
    ),
    65.00,
    'KRT-WHT-001',
    100
),
(
    'd290f1ee-6c54-4b01-90e6-d701748f0856',
    'Kids Festival Kurta',
    'kids-festival-kurta',
    'Colorful festival kurta for kids',
    49.99,
    NULL,
    'active',
    jsonb_build_object(
        'tags', array['kids', 'kurta', 'festival'],
        'slug', 'kids-festival-kurta'
    ),
    25.00,
    'KRT-KID-001',
    100
);

-- Insert variant options
INSERT INTO variant_options (id, name, values, additional_costs) VALUES
('d290f1ee-6c54-4b01-90e6-d701748f0860', 'size', ARRAY['S', 'M', 'L'], '{"S": 0, "M": 0, "L": 0}'::jsonb);

-- Insert variant brackets
INSERT INTO variant_brackets (id, product_id, name) VALUES
('d290f1ee-6c54-4b01-90e6-d701748f0861', 'd290f1ee-6c54-4b01-90e6-d701748f0854', 'Size Options');

-- Link variant options to brackets
INSERT INTO variant_bracket_options (bracket_id, option_id, position) VALUES
('d290f1ee-6c54-4b01-90e6-d701748f0861', 'd290f1ee-6c54-4b01-90e6-d701748f0860', 0);

-- Insert test product variants
INSERT INTO product_variants (
    id,
    product_id,
    sku,
    price,
    inventory_quantity,
    attributes,
    status
) VALUES
(
    'd290f1ee-6c54-4b01-90e6-d701748f0857',
    'd290f1ee-6c54-4b01-90e6-d701748f0854',
    'KRT-BLK-001-S',
    89.99,
    30,
    jsonb_build_object('size', 'S'),
    'active'
),
(
    'd290f1ee-6c54-4b01-90e6-d701748f0858',
    'd290f1ee-6c54-4b01-90e6-d701748f0854',
    'KRT-BLK-001-M',
    89.99,
    40,
    jsonb_build_object('size', 'M'),
    'active'
),
(
    'd290f1ee-6c54-4b01-90e6-d701748f0859',
    'd290f1ee-6c54-4b01-90e6-d701748f0854',
    'KRT-BLK-001-L',
    89.99,
    30,
    jsonb_build_object('size', 'L'),
    'active'
);

-- Insert product-collection relationships
INSERT INTO product_collections (product_id, collection_id) VALUES
('d290f1ee-6c54-4b01-90e6-d701748f0854', 'd290f1ee-6c54-4b01-90e6-d701748f0851'),
('d290f1ee-6c54-4b01-90e6-d701748f0855', 'd290f1ee-6c54-4b01-90e6-d701748f0851'),
('d290f1ee-6c54-4b01-90e6-d701748f0856', 'd290f1ee-6c54-4b01-90e6-d701748f0853');

-- Insert test order analytics data
DELETE FROM order_analytics WHERE date >= '2024-03-01' AND date <= '2024-03-05';
INSERT INTO order_analytics (
    date,
    total_orders,
    total_revenue,
    average_order_value,
    total_profit,
    profit_margin,
    return_rate
) VALUES
('2024-03-01', 25, 2499.75, 99.99, 1249.88, 50.00, 2.5),
('2024-03-02', 30, 2999.70, 99.99, 1499.85, 50.00, 2.0),
('2024-03-03', 28, 2799.72, 99.99, 1399.86, 50.00, 1.8),
('2024-03-04', 35, 3499.65, 99.99, 1749.83, 50.00, 2.2),
('2024-03-05', 32, 3199.68, 99.99, 1599.84, 50.00, 2.1);

-- Insert test conversion metrics
DELETE FROM conversion_metrics WHERE date >= '2024-03-01' AND date <= '2024-03-05';
INSERT INTO conversion_metrics (
    date,
    cart_views,
    checkout_starts,
    checkout_completions,
    successful_orders,
    abandoned_cart_rate
) VALUES
('2024-03-01', 150, 50, 30, 25, 50.00),
('2024-03-02', 180, 60, 35, 30, 50.00),
('2024-03-03', 165, 55, 32, 28, 49.09),
('2024-03-04', 200, 70, 40, 35, 50.00),
('2024-03-05', 190, 65, 38, 32, 50.77); 