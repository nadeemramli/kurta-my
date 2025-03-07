-- Enable RLS on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Products policies
CREATE POLICY "Public Read Active Products" ON products
FOR SELECT USING (status = 'active');

CREATE POLICY "Admin Full Access Products" ON products
FOR ALL USING (auth.role() = 'authenticated' AND auth.jwt()->>'role' = 'admin');

-- Categories policies
CREATE POLICY "Public Read Categories" ON categories
FOR SELECT USING (true);

CREATE POLICY "Admin Full Access Categories" ON categories
FOR ALL USING (auth.role() = 'authenticated' AND auth.jwt()->>'role' = 'admin');

-- Collections policies
CREATE POLICY "Public Read Collections" ON collections
FOR SELECT USING (true);

CREATE POLICY "Admin Full Access Collections" ON collections
FOR ALL USING (auth.role() = 'authenticated' AND auth.jwt()->>'role' = 'admin');

-- Orders policies
CREATE POLICY "Customers Read Own Orders" ON orders
FOR SELECT USING (auth.role() = 'authenticated' AND customer_id = auth.uid()::uuid);

CREATE POLICY "Admin Full Access Orders" ON orders
FOR ALL USING (auth.role() = 'authenticated' AND auth.jwt()->>'role' = 'admin');

-- Customer policies
CREATE POLICY "Customers Read Own Profile" ON customers
FOR SELECT USING (auth.role() = 'authenticated' AND id = auth.uid()::uuid);

CREATE POLICY "Customers Update Own Profile" ON customers
FOR UPDATE USING (auth.role() = 'authenticated' AND id = auth.uid()::uuid);

CREATE POLICY "Admin Full Access Customers" ON customers
FOR ALL USING (auth.role() = 'authenticated' AND auth.jwt()->>'role' = 'admin');

-- Pages policies
CREATE POLICY "Public Read Published Pages" ON pages
FOR SELECT USING (status = 'published');

CREATE POLICY "Admin Full Access Pages" ON pages
FOR ALL USING (auth.role() = 'authenticated' AND auth.jwt()->>'role' = 'admin');

-- Blog posts policies
CREATE POLICY "Public Read Published Posts" ON blog_posts
FOR SELECT USING (status = 'published');

CREATE POLICY "Admin Full Access Posts" ON blog_posts
FOR ALL USING (auth.role() = 'authenticated' AND auth.jwt()->>'role' = 'admin');

-- Promotions policies
CREATE POLICY "Public Read Active Promotions" ON promotions
FOR SELECT USING (status = 'active');

CREATE POLICY "Admin Full Access Promotions" ON promotions
FOR ALL USING (auth.role() = 'authenticated' AND auth.jwt()->>'role' = 'admin');

-- Analytics policies (admin only)
CREATE POLICY "Admin Access Analytics" ON order_analytics
FOR ALL USING (auth.role() = 'authenticated' AND auth.jwt()->>'role' = 'admin');

CREATE POLICY "Admin Access Traffic Analytics" ON traffic_analytics
FOR ALL USING (auth.role() = 'authenticated' AND auth.jwt()->>'role' = 'admin');

CREATE POLICY "Admin Access Conversion Metrics" ON conversion_metrics
FOR ALL USING (auth.role() = 'authenticated' AND auth.jwt()->>'role' = 'admin');

-- Settings policies (admin only)
CREATE POLICY "Admin Access Settings" ON settings
FOR ALL USING (auth.role() = 'authenticated' AND auth.jwt()->>'role' = 'admin'); 