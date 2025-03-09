-- Function to update order status
CREATE OR REPLACE FUNCTION update_order_status(
    p_order_id UUID,
    p_status order_status,
    p_payment_status payment_status DEFAULT NULL
) RETURNS void AS $$
BEGIN
    UPDATE orders
    SET 
        status = p_status,
        payment_status = COALESCE(p_payment_status, payment_status),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_order_id;

    -- If order is completed, update customer metrics
    IF p_status = 'completed' THEN
        UPDATE customers c
        SET 
            orders_count = orders_count + 1,
            total_spent = total_spent + (SELECT total_amount FROM orders WHERE id = p_order_id),
            last_order_id = p_order_id
        FROM orders o
        WHERE o.id = p_order_id AND c.id = o.customer_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to remove item from order
CREATE OR REPLACE FUNCTION remove_order_item(
    p_order_id UUID,
    p_order_item_id UUID
) RETURNS void AS $$
BEGIN
    -- Delete the order item
    DELETE FROM order_items
    WHERE id = p_order_item_id AND order_id = p_order_id;

    -- Recalculate order totals
    PERFORM calculate_order_totals(p_order_id);
END;
$$ LANGUAGE plpgsql;

-- Function to update order item quantity
CREATE OR REPLACE FUNCTION update_order_item_quantity(
    p_order_item_id UUID,
    p_quantity INTEGER
) RETURNS void AS $$
DECLARE
    v_order_id UUID;
    v_unit_price DECIMAL(10,2);
BEGIN
    -- Get order ID and unit price
    SELECT order_id, unit_price INTO v_order_id, v_unit_price
    FROM order_items
    WHERE id = p_order_item_id;

    -- Update quantity and total price
    UPDATE order_items
    SET 
        quantity = p_quantity,
        total_price = unit_price * p_quantity
    WHERE id = p_order_item_id;

    -- Recalculate order totals
    PERFORM calculate_order_totals(v_order_id);
END;
$$ LANGUAGE plpgsql;

-- Function to apply shipping cost
CREATE OR REPLACE FUNCTION apply_shipping_cost(
    p_order_id UUID,
    p_shipping_amount DECIMAL(10,2)
) RETURNS void AS $$
BEGIN
    UPDATE orders
    SET 
        shipping_amount = p_shipping_amount,
        total_amount = subtotal_amount + p_shipping_amount + tax_amount - discount_amount,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_order_id;
END;
$$ LANGUAGE plpgsql;

-- Function to apply tax
CREATE OR REPLACE FUNCTION apply_tax(
    p_order_id UUID,
    p_tax_amount DECIMAL(10,2)
) RETURNS void AS $$
BEGIN
    UPDATE orders
    SET 
        tax_amount = p_tax_amount,
        total_amount = subtotal_amount + shipping_amount + p_tax_amount - discount_amount,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_order_id;
END;
$$ LANGUAGE plpgsql;

-- Function to apply discount
CREATE OR REPLACE FUNCTION apply_discount(
    p_order_id UUID,
    p_discount_amount DECIMAL(10,2)
) RETURNS void AS $$
BEGIN
    UPDATE orders
    SET 
        discount_amount = p_discount_amount,
        total_amount = subtotal_amount + shipping_amount + tax_amount - p_discount_amount,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_order_id;
END;
$$ LANGUAGE plpgsql;

-- Function to process payment
CREATE OR REPLACE FUNCTION process_payment(
    p_order_id UUID,
    p_payment_method TEXT,
    p_payment_details JSONB DEFAULT '{}'::JSONB
) RETURNS JSONB AS $$
DECLARE
    v_order orders;
    v_response JSONB;
BEGIN
    -- Get order details
    SELECT * INTO v_order
    FROM orders
    WHERE id = p_order_id;

    -- Validate order status
    IF v_order.status = 'completed' THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'Order already completed'
        );
    END IF;

    -- Here you would typically integrate with a payment gateway
    -- For now, we'll simulate a successful payment
    v_response := jsonb_build_object(
        'success', true,
        'transaction_id', uuid_generate_v4(),
        'amount', v_order.total_amount,
        'payment_method', p_payment_method,
        'payment_details', p_payment_details
    );

    -- Update order status
    IF (v_response->>'success')::boolean THEN
        PERFORM update_order_status(
            p_order_id,
            'completed'::order_status,
            'paid'::payment_status
        );
    END IF;

    RETURN v_response;
END;
$$ LANGUAGE plpgsql;

-- Function to get order summary
CREATE OR REPLACE FUNCTION get_order_summary(p_order_id UUID)
RETURNS TABLE (
    order_id UUID,
    customer_name TEXT,
    status order_status,
    payment_status payment_status,
    total_amount DECIMAL(10,2),
    items_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.id,
        c.first_name || ' ' || c.last_name,
        o.status,
        o.payment_status,
        o.total_amount,
        COUNT(oi.id)::INTEGER,
        o.created_at
    FROM orders o
    JOIN customers c ON c.id = o.customer_id
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE o.id = p_order_id
    GROUP BY o.id, c.first_name, c.last_name;
END;
$$ LANGUAGE plpgsql; 