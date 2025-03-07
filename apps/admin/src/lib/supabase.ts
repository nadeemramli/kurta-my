import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@kurta-my/database";

export const createClient = () => {
  const client = createClientComponentClient<Database>();
  return client;
};

// Create a singleton instance
export const supabase = createClient();

// Re-export types from the database package
export type { SupabaseClient }; 