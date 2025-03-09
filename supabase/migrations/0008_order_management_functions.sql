-- Create helper function to calculate order totals
CREATE OR REPLACE FUNCTION calculate_order_totals(order_id UUID)
RETURNS void AS $$
DECLARE
    subtotal DECIMAL(10,2);
BEGIN
    -- Calculate subtotal from order items
    SELECT COALESCE(SUM(total_price), 0)
    INTO subtotal
    FROM order_items
    WHERE order_items.order_id = calculate_order_totals.order_id;

    -- Update order with new totals
    UPDATE orders
    SET 
        subtotal_amount = subtotal,
        total_amount = subtotal + shipping_amount + tax_amount - discount_amount
    WHERE id = order_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to create a draft order
CREATE OR REPLACE FUNCTION create_draft_order(
    p_customer_id UUID,
    p_shipping_address JSONB,
    p_billing_address JSONB
) RETURNS UUID AS $$
DECLARE
    new_order_id UUID;
BEGIN
    INSERT INTO orders (
        customer_id,
        status,
        total_amount,
        subtotal_amount,
        tax_amount,
        shipping_amount,
        discount_amount,
        shipping_address,
        billing_address,
        payment_status,
        payment_method
    ) VALUES (
        p_customer_id,
        'draft',
        0,
        0,
        0,
        0,
        0,
        p_shipping_address,
        p_billing_address,
        'pending',
        'pending'
    ) RETURNING id INTO new_order_id;

    RETURN new_order_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to add item to order
CREATE OR REPLACE FUNCTION add_order_item(
    p_order_id UUID,
    p_product_id UUID,
    p_variant_id UUID,
    p_quantity INTEGER
) RETURNS UUID AS $$
DECLARE
    product_price DECIMAL(10,2);
    new_item_id UUID;
BEGIN
    -- Get product price (from variant if specified, otherwise from product)
    IF p_variant_id IS NOT NULL THEN
        SELECT price INTO product_price
        FROM product_variants
        WHERE id = p_variant_id;
    ELSE
        SELECT price INTO product_price
        FROM products
        WHERE id = p_product_id;
    END IF;

    -- Insert order item
    INSERT INTO order_items (
        order_id,
        product_id,
        variant_id,
        quantity,
        unit_price,
        total_price
    ) VALUES (
        p_order_id,
        p_product_id,
        p_variant_id,
        p_quantity,
        product_price,
        product_price * p_quantity
    ) RETURNING id INTO new_item_id;

    -- Recalculate order totals
    PERFORM calculate_order_totals(p_order_id);

    RETURN new_item_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate test orders
CREATE OR REPLACE FUNCTION generate_test_orders(num_orders INTEGER)
RETURNS void AS $$
DECLARE
    customer_id UUID;
    product_id UUID;
    order_id UUID;
    address_json JSONB;
BEGIN
    -- Get a customer (assuming we have at least one)
    SELECT id INTO customer_id FROM customers LIMIT 1;
    
    -- Get a product (assuming we have at least one)
    SELECT id INTO product_id FROM products LIMIT 1;

    -- Sample address
    address_json := '{
        "address_line1": "123 Test St",
        "city": "Test City",
        "state": "TS",
        "postal_code": "12345",
        "country": "Test Country"
    }'::JSONB;

    -- Generate orders
    FOR i IN 1..num_orders LOOP
        -- Create draft order
        order_id := create_draft_order(
            customer_id,
            address_json,
            address_json
        );

        -- Add some items
        PERFORM add_order_item(order_id, product_id, NULL, floor(random() * 5 + 1)::INTEGER);

        -- Randomly set some orders to different statuses
        UPDATE orders 
        SET status = CASE floor(random() * 4)::INTEGER
            WHEN 0 THEN 'draft'
            WHEN 1 THEN 'pending'
            WHEN 2 THEN 'processing'
            WHEN 3 THEN 'completed'
            END,
            payment_status = CASE floor(random() * 3)::INTEGER
            WHEN 0 THEN 'pending'
            WHEN 1 THEN 'paid'
            WHEN 2 THEN 'failed'
            END
        WHERE id = order_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create function to update analytics tables
CREATE OR REPLACE FUNCTION update_order_analytics(p_date DATE)
RETURNS void AS $$
DECLARE
    total_orders_count INTEGER;
    total_revenue_sum DECIMAL(10,2);
    avg_order_value DECIMAL(10,2);
    profit_sum DECIMAL(10,2);
    profit_margin_calc DECIMAL(5,2);
BEGIN
    -- Calculate metrics for the given date
    SELECT 
        COUNT(*),
        COALESCE(SUM(total_amount), 0),
        COALESCE(AVG(total_amount), 0)
    INTO 
        total_orders_count,
        total_revenue_sum,
        avg_order_value
    FROM orders
    WHERE DATE(created_at) = p_date
    AND status != 'draft';

    -- Insert or update analytics
    INSERT INTO order_analytics (
        date,
        total_orders,
        total_revenue,
        average_order_value
    ) VALUES (
        p_date,
        total_orders_count,
        total_revenue_sum,
        avg_order_value
    )
    ON CONFLICT (date) DO UPDATE
    SET 
        total_orders = EXCLUDED.total_orders,
        total_revenue = EXCLUDED.total_revenue,
        average_order_value = EXCLUDED.average_order_value;
END;
$$ LANGUAGE plpgsql; 