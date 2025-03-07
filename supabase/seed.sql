-- Seed data for testing

-- Insert test categories
INSERT INTO categories (id, title, slug, description) VALUES
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Men', 'men', 'Men''s clothing'),
('d290f1ee-6c54-4b01-90e6-d701748f0852', 'Women', 'women', 'Women''s clothing'),
('d290f1ee-6c54-4b01-90e6-d701748f0853', 'Kids', 'kids', 'Kids'' clothing');

-- Insert test products
INSERT INTO products (id, title, slug, description, price, cost_per_item, sku, inventory_quantity, status) VALUES
('d290f1ee-6c54-4b01-90e6-d701748f0854', 'Classic Black Kurta', 'classic-black-kurta', 'A timeless black kurta for men', 89.99, 45.00, 'KRT-BLK-001', 100, 'active'),
('d290f1ee-6c54-4b01-90e6-d701748f0855', 'Embroidered White Kurta', 'embroidered-white-kurta', 'Elegant white kurta with traditional embroidery', 129.99, 65.00, 'KRT-WHT-001', 75, 'active'),
('d290f1ee-6c54-4b01-90e6-d701748f0856', 'Kids Festival Kurta', 'kids-festival-kurta', 'Colorful festival kurta for kids', 49.99, 25.00, 'KRT-KDS-001', 50, 'active');

-- Insert test product variants
INSERT INTO product_variants (id, product_id, title, sku, price, inventory_quantity, option1_name, option1_value) VALUES
('d290f1ee-6c54-4b01-90e6-d701748f0857', 'd290f1ee-6c54-4b01-90e6-d701748f0854', 'Classic Black Kurta - S', 'KRT-BLK-001-S', 89.99, 30, 'Size', 'S'),
('d290f1ee-6c54-4b01-90e6-d701748f0858', 'd290f1ee-6c54-4b01-90e6-d701748f0854', 'Classic Black Kurta - M', 'KRT-BLK-001-M', 89.99, 40, 'Size', 'M'),
('d290f1ee-6c54-4b01-90e6-d701748f0859', 'd290f1ee-6c54-4b01-90e6-d701748f0854', 'Classic Black Kurta - L', 'KRT-BLK-001-L', 89.99, 30, 'Size', 'L');

-- Insert test product images
INSERT INTO product_images (id, product_id, url, alt, position, is_primary) VALUES
('d290f1ee-6c54-4b01-90e6-d701748f0860', 'd290f1ee-6c54-4b01-90e6-d701748f0854', 'https://example.com/images/classic-black-kurta.jpg', 'Classic Black Kurta', 1, true),
('d290f1ee-6c54-4b01-90e6-d701748f0861', 'd290f1ee-6c54-4b01-90e6-d701748f0855', 'https://example.com/images/white-kurta.jpg', 'Embroidered White Kurta', 1, true),
('d290f1ee-6c54-4b01-90e6-d701748f0862', 'd290f1ee-6c54-4b01-90e6-d701748f0856', 'https://example.com/images/kids-kurta.jpg', 'Kids Festival Kurta', 1, true);

-- Insert test order analytics data
INSERT INTO order_analytics (date, total_orders, total_revenue, average_order_value, total_profit, profit_margin, return_rate) VALUES
('2024-03-01', 25, 2499.75, 99.99, 1249.88, 50.00, 2.5),
('2024-03-02', 30, 2999.70, 99.99, 1499.85, 50.00, 2.0),
('2024-03-03', 28, 2799.72, 99.99, 1399.86, 50.00, 1.8),
('2024-03-04', 35, 3499.65, 99.99, 1749.83, 50.00, 2.2),
('2024-03-05', 32, 3199.68, 99.99, 1599.84, 50.00, 2.1);

-- Insert test conversion metrics
INSERT INTO conversion_metrics (date, cart_views, checkout_starts, checkout_completions, successful_orders, abandoned_cart_rate) VALUES
('2024-03-01', 150, 50, 30, 25, 50.00),
('2024-03-02', 180, 60, 35, 30, 50.00),
('2024-03-03', 165, 55, 32, 28, 49.09),
('2024-03-04', 200, 70, 40, 35, 50.00),
('2024-03-05', 190, 65, 38, 32, 50.77); 