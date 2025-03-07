import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

export type AdminRole = 'owner' | 'operations' | 'marketing' | 'support' | 'content';

export interface AuthUser extends User {
  metadata: {
    isAdmin?: boolean;
    role?: AdminRole;
    name?: string;
  };
}

export interface AuthConfig {
  supabaseUrl: string;
  supabaseKey: string;
}

export class Auth {
  private supabase: SupabaseClient;

  constructor(config: AuthConfig) {
    this.supabase = createClient(config.supabaseUrl, config.supabaseKey);
  }

  async signUp(email: string, password: string, metadata: { name?: string } = {}) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });

    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  async getUser() {
    const { data: { user }, error } = await this.supabase.auth.getUser();
    if (error) throw error;
    return user as AuthUser | null;
  }

  async getSession() {
    const { data: { session }, error } = await this.supabase.auth.getSession();
    if (error) throw error;
    return session;
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return this.supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const user = session?.user as AuthUser;
        callback(user);
      } else if (event === 'SIGNED_OUT') {
        callback(null);
      }
    });
  }

  // Admin-specific methods
  async isAdmin(user: AuthUser | null) {
    if (!user) return false;
    return !!user.user_metadata.isAdmin;
  }

  async hasRole(user: AuthUser | null, requiredRole: AdminRole) {
    if (!user) return false;
    if (!user.user_metadata.isAdmin) return false;
    
    // Owner has access to everything
    if (user.user_metadata.role === 'owner') return true;
    
    return user.user_metadata.role === requiredRole;
  }

  async setAdminRole(userId: string, role: AdminRole) {
    const { data, error } = await this.supabase.rpc('set_admin_role', {
      user_id: userId,
      role: role
    });

    if (error) throw error;
    return data;
  }

  async removeAdminRole(userId: string) {
    const { data, error } = await this.supabase.rpc('remove_admin_role', {
      user_id: userId
    });

    if (error) throw error;
    return data;
  }

  async getAdminRole(userId: string) {
    const { data, error } = await this.supabase.rpc('get_admin_role', {
      user_id: userId
    });

    if (error) throw error;
    return data as AdminRole | null;
  }
} 