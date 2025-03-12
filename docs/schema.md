# Database Schema Documentation

## Core Tables

### Orders
```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id),
    status order_status NOT NULL DEFAULT 'draft',
    total_amount DECIMAL(10,2) NOT NULL,
    subtotal_amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    shipping_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    shipping_address JSONB NOT NULL,
    billing_address JSONB NOT NULL,
    payment_status payment_status NOT NULL DEFAULT 'pending',
    payment_method TEXT NOT NULL,
    notes TEXT,
    communication_channels JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)
```

### Order Items
```sql
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    variant_id UUID REFERENCES product_variants(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)
```

### Customers
```sql
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    accepts_marketing BOOLEAN DEFAULT false,
    total_spent DECIMAL(10,2) DEFAULT 0,
    orders_count INTEGER DEFAULT 0,
    last_order_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)
```

### Products
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
)
```

## Enums

### Order Status
```sql
CREATE TYPE order_status AS ENUM (
    'draft',
    'pending',
    'processing',
    'completed',
    'cancelled'
);
```

### Payment Status
```sql
CREATE TYPE payment_status AS ENUM (
    'pending',
    'paid',
    'failed'
);
```

### Product Status
```sql
CREATE TYPE product_status AS ENUM (
    'draft',
    'active',
    'archived'
);
```

## Core Functions

### Order Management
- `update_order_status(order_id, status, payment_status)`: Updates order status and optionally payment status
- `calculate_order_totals(order_id)`: Recalculates order totals including tax, shipping, and discounts
- `process_payment(order_id, payment_method, payment_details)`: Processes order payment
- `decrease_inventory(product_id, quantity)`: Updates product inventory after order

### Customer Management
- Customer metrics are automatically updated when orders are completed
- Address management with support for multiple addresses per customer

### Product Management
- Inventory tracking
- Variant support
- Collection and category organization

## Relationships
- Orders belong to Customers
- Orders have many Order Items
- Order Items belong to Products
- Products can have many Variants
- Products can belong to many Collections
- Customers can have many Addresses

## Notes
- All monetary values use DECIMAL(10,2) for precision
- All tables include created_at and updated_at timestamps
- Most tables use UUID as primary keys
- Soft deletes are not implemented by default 