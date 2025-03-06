-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

/**
 * ORDERS MODULE
 */

-- Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name VARCHAR NOT NULL,
  customer_email VARCHAR NOT NULL,
  status VARCHAR NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'draft')),
  total DECIMAL(10,2) NOT NULL,
  items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Order Analytics table
CREATE TABLE IF NOT EXISTS public.order_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,
  total_orders INTEGER NOT NULL DEFAULT 0,
  total_revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_profit DECIMAL(10,2) NOT NULL DEFAULT 0,
  average_order_value DECIMAL(10,2) NOT NULL DEFAULT 0,
  return_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  profit_margin DECIMAL(5,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Conversion Metrics table
CREATE TABLE IF NOT EXISTS public.conversion_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,
  cart_views INTEGER NOT NULL DEFAULT 0,
  checkout_starts INTEGER NOT NULL DEFAULT 0,
  checkout_completions INTEGER NOT NULL DEFAULT 0,
  successful_orders INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_analytics_date ON public.order_analytics(date DESC);
CREATE INDEX IF NOT EXISTS idx_conversion_metrics_date ON public.conversion_metrics(date DESC);

-- Triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_order_analytics_updated_at
  BEFORE UPDATE ON public.order_analytics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conversion_metrics_updated_at
  BEFORE UPDATE ON public.conversion_metrics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column(); 