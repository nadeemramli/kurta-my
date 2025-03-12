import { supabase } from './supabase';

export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;

    // Verify admin role
    if (session) {
      const { data: profile } = await supabase
        .from('admin_profiles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        return null;
      }
    }

    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    // Verify admin role
    const { data: profile } = await supabase
      .from('admin_profiles')
      .select('role')
      .eq('user_id', data.user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      await signOut();
      throw new Error('Unauthorized');
    }

    return data;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
} 