-- Add indexes for search functionality
CREATE INDEX IF NOT EXISTS idx_orders_customer_name ON customers(first_name, last_name);
CREATE INDEX IF NOT EXISTS idx_orders_id_search ON orders(id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

-- Add indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_orders_status_date ON orders(status, ordered_at);
CREATE INDEX IF NOT EXISTS idx_orders_payment_date ON orders(payment_status, ordered_at);

-- Add partial indexes for common queries
CREATE INDEX IF NOT EXISTS idx_orders_pending ON orders(ordered_at) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_orders_processing ON orders(ordered_at) WHERE status = 'processing';
CREATE INDEX IF NOT EXISTS idx_orders_completed ON orders(ordered_at) WHERE status = 'completed';

-- Add index for payment processing
CREATE INDEX IF NOT EXISTS idx_orders_pending_payment ON orders(ordered_at) 
WHERE payment_status = 'pending';

-- Add composite index for customer orders by date
CREATE INDEX IF NOT EXISTS idx_customer_orders_date ON orders(customer_id, ordered_at DESC);

-- Add indexes for address and notes search
CREATE INDEX IF NOT EXISTS idx_orders_shipping_address ON orders USING gin (shipping_address);
CREATE INDEX IF NOT EXISTS idx_orders_billing_address ON orders USING gin (billing_address);
CREATE INDEX IF NOT EXISTS idx_orders_notes_search ON orders USING gin (to_tsvector('english', notes)); 