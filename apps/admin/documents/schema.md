# Database Schema Documentation

## Orders Module

### order_analytics
Stores daily aggregated order analytics data.

```sql
CREATE TABLE order_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  total_orders INTEGER NOT NULL DEFAULT 0,
  total_revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_profit DECIMAL(10,2) NOT NULL DEFAULT 0,
  average_order_value DECIMAL(10,2) NOT NULL DEFAULT 0,
  return_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  profit_margin DECIMAL(5,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(date)
);

-- Create an index for faster date-based queries
CREATE INDEX idx_order_analytics_date ON order_analytics(date);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_order_analytics_updated_at
  BEFORE UPDATE ON order_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### orders (Coming Soon)
Main orders table that will store individual order records.

### order_items (Coming Soon)
Table to store individual items within each order.

### order_status_history (Coming Soon)
Table to track order status changes over time.

## Component Dependencies
The following React components rely on this schema:

1. OrderMetrics (`/components/orders/analytics/OrderMetrics.tsx`)
   - Uses: order_analytics
   - Fields: total_orders, total_revenue, average_order_value, return_rate, total_profit, profit_margin

2. OrderTrends (`/components/orders/analytics/OrderTrends.tsx`)
   - Uses: order_analytics
   - Fields: date, total_orders, total_revenue

## API Endpoints (Coming Soon)
- GET /api/analytics/orders/metrics
- GET /api/analytics/orders/trends
- GET /api/analytics/orders/returns
