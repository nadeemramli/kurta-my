import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

export const createSupabaseClient = (url: string, key: string) => {
  return createClient<Database>(url, key);
};

export type SupabaseClient = ReturnType<typeof createSupabaseClient>;
export * from './lib/supabase';
export * from './services/orders';

/**
 * Main entry point for the database package
 * This exports all the modules that can be used by applications and edge functions
 */

// Export types
export * from './types';

// Export services
export * from './services';

// Export edge function utilities
export * from './edge-functions';

// Export any other utilities
export * from './utils';