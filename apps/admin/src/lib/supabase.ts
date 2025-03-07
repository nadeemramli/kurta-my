import { createSupabaseClient, type SupabaseClient } from '@kurta-my/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createSupabaseClient(supabaseUrl, supabaseKey);

// Re-export types from the database package
export type { Database } from '@kurta-my/database';
export type { SupabaseClient }; 