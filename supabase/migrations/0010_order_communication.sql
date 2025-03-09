-- Add communication preferences and delivery options to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS communication_channels JSONB DEFAULT '{"whatsapp": false, "email": false, "sms": false}'::jsonb,
ADD COLUMN IF NOT EXISTS delivery_option TEXT DEFAULT 'standard';

-- Create type for delivery options
CREATE TYPE delivery_option AS ENUM ('standard', 'express');

-- Create function to validate communication channels
CREATE OR REPLACE FUNCTION validate_communication_channels()
RETURNS trigger AS $$
BEGIN
  -- Ensure the communication_channels JSON has the required structure
  IF NOT (NEW.communication_channels ? 'whatsapp' AND 
          NEW.communication_channels ? 'email' AND 
          NEW.communication_channels ? 'sms') THEN
    RAISE EXCEPTION 'Invalid communication channels structure';
  END IF;

  -- If WhatsApp is enabled, ensure there's a phone number
  IF (NEW.communication_channels->>'whatsapp')::boolean = true AND 
     (NEW.shipping_address->>'phone' IS NULL OR NEW.shipping_address->>'phone' = '') THEN
    RAISE EXCEPTION 'Phone number is required for WhatsApp notifications';
  END IF;

  -- If email is enabled, ensure there's an email address
  IF (NEW.communication_channels->>'email')::boolean = true AND 
     (NEW.shipping_address->>'email' IS NULL OR NEW.shipping_address->>'email' = '') THEN
    RAISE EXCEPTION 'Email address is required for email notifications';
  END IF;

  -- If SMS is enabled, ensure there's a phone number
  IF (NEW.communication_channels->>'sms')::boolean = true AND 
     (NEW.shipping_address->>'phone' IS NULL OR NEW.shipping_address->>'phone' = '') THEN
    RAISE EXCEPTION 'Phone number is required for SMS notifications';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for communication channels validation
DROP TRIGGER IF EXISTS validate_communication_channels_trigger ON orders;
CREATE TRIGGER validate_communication_channels_trigger
  BEFORE INSERT OR UPDATE OF communication_channels, shipping_address
  ON orders
  FOR EACH ROW
  EXECUTE FUNCTION validate_communication_channels();

-- Update existing orders with default communication preferences
UPDATE orders
SET communication_channels = '{"whatsapp": false, "email": false, "sms": false}'::jsonb
WHERE communication_channels IS NULL;

-- Function to update communication preferences
CREATE OR REPLACE FUNCTION update_communication_preferences(
  p_order_id UUID,
  p_preferences JSONB
) RETURNS void AS $$
BEGIN
  UPDATE orders
  SET 
    communication_channels = p_preferences,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = p_order_id;
END;
$$ LANGUAGE plpgsql; 