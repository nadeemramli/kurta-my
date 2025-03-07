# Database Schema Documentation

## Orders Module

### orders
Main orders table that stores individual order records.

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  status order_status NOT NULL DEFAULT 'draft',
  total_amount DECIMAL(10,2) NOT NULL,
  subtotal_amount DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) NOT NULL,
  shipping_amount DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) NOT NULL,
  shipping_address TEXT NOT NULL,
  billing_address TEXT NOT NULL,
  payment_status payment_status NOT NULL DEFAULT 'pending',
  payment_method TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### order_items
Table to store individual items within each order.

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  product_id UUID NOT NULL REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### order_analytics
Stores daily aggregated order analytics data.

```sql
CREATE TABLE order_analytics (
  date DATE NOT NULL,
  total_orders INTEGER NOT NULL,
  total_revenue DECIMAL(10,2) NOT NULL,
  average_order_value DECIMAL(10,2) NOT NULL,
  total_profit DECIMAL(10,2) NOT NULL,
  profit_margin DECIMAL(5,2) NOT NULL,
  return_rate DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### conversion_metrics
Stores daily conversion funnel metrics.

```sql
CREATE TABLE conversion_metrics (
  date DATE NOT NULL,
  cart_views INTEGER NOT NULL,
  checkout_starts INTEGER NOT NULL,
  checkout_completions INTEGER NOT NULL,
  successful_orders INTEGER NOT NULL,
  abandoned_cart_rate DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Products Module

### products
Main products table.

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  cost_per_item DECIMAL(10,2) NOT NULL,
  sku TEXT NOT NULL UNIQUE,
  barcode TEXT UNIQUE,
  inventory_quantity INTEGER NOT NULL DEFAULT 0,
  status product_status NOT NULL DEFAULT 'draft',
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### product_variants
Stores product variants with different options.

```sql
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id),
  title TEXT NOT NULL,
  sku TEXT NOT NULL UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  inventory_quantity INTEGER NOT NULL DEFAULT 0,
  option1_name TEXT,
  option1_value TEXT,
  option2_name TEXT,
  option2_value TEXT,
  option3_name TEXT,
  option3_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### product_images
Stores product images.

```sql
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id),
  url TEXT NOT NULL,
  alt TEXT,
  position INTEGER NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Categories and Collections

### categories
Product categories hierarchy.

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES categories(id),
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### collections
Product collections for merchandising.

```sql
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Component Dependencies

### Admin App Components
1. OrderMetrics (`/components/orders/analytics/OrderMetrics.tsx`)
   - Uses: order_analytics
   - Fields: total_orders, total_revenue, average_order_value, total_profit, profit_margin

2. OrderTrends (`/components/orders/analytics/OrderTrends.tsx`)
   - Uses: order_analytics
   - Fields: date, total_orders, total_revenue

3. ConversionMetrics (`/components/orders/conversion/ConversionMetrics.tsx`)
   - Uses: conversion_metrics
   - Fields: cart_views, checkout_starts, checkout_completions, successful_orders, abandoned_cart_rate

### Frontend App Components
1. ProductCard (`/components/product/ProductCard.tsx`)
   - Uses: products, product_images
   - Fields: title, price, compare_at_price, images

2. ProductGrid (`/components/product/ProductGrid.tsx`)
   - Uses: products, product_images
   - Fields: title, price, compare_at_price, images

## API Endpoints

### Orders
- GET /api/orders - List orders
- GET /api/orders/:id - Get order details
- POST /api/orders - Create order
- PUT /api/orders/:id - Update order
- DELETE /api/orders/:id - Delete order

### Products
- GET /api/products - List products
- GET /api/products/:id - Get product details
- POST /api/products - Create product
- PUT /api/products/:id - Update product
- DELETE /api/products/:id - Delete product

### Analytics
- GET /api/analytics/orders/metrics - Get order metrics
- GET /api/analytics/orders/trends - Get order trends
- GET /api/analytics/conversion - Get conversion metrics
