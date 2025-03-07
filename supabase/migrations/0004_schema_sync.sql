-- Add trigger function for updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to all tables with updated_at column
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_addresses_updated_at
  BEFORE UPDATE ON customer_addresses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at
  BEFORE UPDATE ON product_variants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_categories_updated_at
  BEFORE UPDATE ON blog_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_promotions_updated_at
  BEFORE UPDATE ON promotions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add additional indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_promotions_starts_at ON promotions(starts_at DESC);
CREATE INDEX IF NOT EXISTS idx_promotions_ends_at ON promotions(ends_at DESC);

-- Add computed columns for analytics
ALTER TABLE orders ADD COLUMN IF NOT EXISTS profit DECIMAL(10,2) 
GENERATED ALWAYS AS (
  total_amount - tax_amount - shipping_amount - discount_amount
) STORED;

-- Add functions for analytics calculations
CREATE OR REPLACE FUNCTION calculate_daily_analytics()
RETURNS void AS $$
BEGIN
  -- Update order analytics
  INSERT INTO order_analytics (
    date,
    total_orders,
    total_revenue,
    average_order_value,
    total_profit,
    profit_margin,
    return_rate
  )
  SELECT
    DATE(created_at),
    COUNT(*),
    SUM(total_amount),
    AVG(total_amount),
    SUM(profit),
    CASE 
      WHEN SUM(total_amount) = 0 THEN 0 
      ELSE (SUM(profit) / SUM(total_amount)) * 100 
    END,
    0 -- Return rate calculation to be implemented
  FROM orders
  WHERE status = 'completed'
  GROUP BY DATE(created_at)
  ON CONFLICT (date) DO UPDATE SET
    total_orders = EXCLUDED.total_orders,
    total_revenue = EXCLUDED.total_revenue,
    average_order_value = EXCLUDED.average_order_value,
    total_profit = EXCLUDED.total_profit,
    profit_margin = EXCLUDED.profit_margin;

  -- Update conversion metrics
  INSERT INTO conversion_metrics (
    date,
    cart_views,
    checkout_starts,
    checkout_completions,
    successful_orders,
    abandoned_cart_rate
  )
  SELECT
    DATE(created_at),
    0, -- Cart views to be implemented with event tracking
    COUNT(*) FILTER (WHERE status IN ('draft', 'pending')),
    COUNT(*) FILTER (WHERE status = 'processing'),
    COUNT(*) FILTER (WHERE status = 'completed'),
    CASE 
      WHEN COUNT(*) FILTER (WHERE status IN ('draft', 'pending')) = 0 THEN 0
      ELSE (1 - (COUNT(*) FILTER (WHERE status = 'completed')::float / 
            COUNT(*) FILTER (WHERE status IN ('draft', 'pending'))::float)) * 100
    END
  FROM orders
  GROUP BY DATE(created_at)
  ON CONFLICT (date) DO UPDATE SET
    checkout_starts = EXCLUDED.checkout_starts,
    checkout_completions = EXCLUDED.checkout_completions,
    successful_orders = EXCLUDED.successful_orders,
    abandoned_cart_rate = EXCLUDED.abandoned_cart_rate;
END;
$$ LANGUAGE plpgsql;

-- Create a function to update customer metrics
CREATE OR REPLACE FUNCTION update_customer_metrics()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW.status = 'completed' AND OLD.status != 'completed') THEN
    UPDATE customers
    SET 
      total_spent = total_spent + NEW.total_amount,
      orders_count = orders_count + 1,
      last_order_id = NEW.id
    WHERE id = NEW.customer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for customer metrics
CREATE TRIGGER update_customer_metrics_on_order
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_metrics(); 