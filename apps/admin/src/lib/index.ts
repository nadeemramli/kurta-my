import { createSupabaseClient } from '@kurta-my/database';
import { ChipService } from '@kurta-my/payments';
export { cn } from '@kurta-my/utils';

// Initialize Supabase client
export const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Initialize Chip payment service
export const chipService = new ChipService({
  brand_id: process.env.CHIP_BRAND_ID!,
  api_key: process.env.CHIP_LIVE_KEY!,
  is_sandbox: process.env.NODE_ENV === 'development',
}); 