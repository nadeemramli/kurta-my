import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

export const createSupabaseClient = (url: string, key: string) => {
  return createClient<Database>(url, key);
};

export type SupabaseClient = ReturnType<typeof createSupabaseClient>;
export * from './types';
export * from './lib/supabase';
export * from './services/orders';
export * from './services/analytics'; 