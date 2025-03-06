import { createClient } from '@supabase/supabase-js';

export const createSupabaseClient = (url: string, key: string) => {
  return createClient(url, key);
};

export * from './types';
export * from './lib/supabase';
export * from './services/orders';
export * from './services/analytics'; 