"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { AuthUser, AdminRole } from "@kurta-my/auth";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface AdminAuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: AdminRole) => Promise<boolean>;
  role: AdminRole | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined
);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<AdminRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAdminAccess = async (user: AuthUser) => {
    // First check the user metadata directly
    const directIsAdmin = user.user_metadata?.isAdmin === true;
    const directRole = user.user_metadata?.role as AdminRole | undefined;

    if (directIsAdmin && directRole) {
      console.log("Admin access granted from direct metadata:", {
        isAdmin: directIsAdmin,
        role: directRole,
        metadata: user.user_metadata,
      });
      return { isAdmin: true, role: directRole };
    }

    // If not found in direct metadata, try getting fresh user data
    try {
      const {
        data: { user: freshUser },
      } = await supabase.auth.getUser();

      if (!freshUser) {
        console.log("No fresh user data found");
        return { isAdmin: false, role: null };
      }

      const isAdmin = freshUser.user_metadata?.isAdmin === true;
      const role = freshUser.user_metadata?.role as AdminRole | undefined;

      console.log("Fresh user metadata check:", {
        isAdmin,
        role,
        metadata: freshUser.user_metadata,
      });

      return { isAdmin, role: role || null };
    } catch (error) {
      console.error("Error getting fresh user data:", error);
      // Fallback to direct metadata if fresh check fails
      return {
        isAdmin: directIsAdmin,
        role: directRole || null,
      };
    }
  };

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user && mounted) {
          const { isAdmin, role } = await checkAdminAccess(
            session.user as AuthUser
          );
          if (isAdmin && role) {
            setUser(session.user as AuthUser);
            setRole(role);
            if (window.location.pathname === "/login") {
              router.replace("/admin");
            }
          } else {
            await supabase.auth.signOut();
            setUser(null);
            setRole(null);
            router.replace("/login");
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);

      if (!mounted) return;
      setIsLoading(true);

      try {
        if (event === "SIGNED_IN" && session?.user) {
          const { isAdmin, role } = await checkAdminAccess(
            session.user as AuthUser
          );
          if (isAdmin && role) {
            setUser(session.user as AuthUser);
            setRole(role);
            router.replace("/admin");
          } else {
            await supabase.auth.signOut();
            setUser(null);
            setRole(null);
            router.replace("/login");
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setRole(null);
          router.replace("/login");
        }
      } catch (error) {
        console.error("Error handling auth state change:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Attempting login for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error("No user returned after sign in");

      console.log("User signed in successfully:", {
        id: data.user.id,
        email: data.user.email,
        metadata: data.user.user_metadata,
      });

      const { isAdmin, role } = await checkAdminAccess(data.user as AuthUser);

      console.log("Admin access check result:", { isAdmin, role });

      if (!isAdmin || !role) {
        console.error("Unauthorized access attempt:", {
          isAdmin,
          role,
          metadata: data.user.user_metadata,
        });
        await supabase.auth.signOut();
        throw new Error("Unauthorized: Admin access only");
      }

      setUser(data.user as AuthUser);
      setRole(role);
      router.replace("/admin");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setRole(null);
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = async (requiredRole: AdminRole) => {
    if (!user || !role) return false;
    const { isAdmin, role: currentRole } = await checkAdminAccess(user);
    return isAdmin && currentRole === requiredRole;
  };

  return (
    <AdminAuthContext.Provider
      value={{ user, isLoading, login, logout, hasRole, role }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}

// Hook to protect routes based on role
export function useRequireRole(requiredRole: AdminRole) {
  const { hasRole, isLoading } = useAdminAuth();
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      hasRole(requiredRole).then((result) => {
        if (!result) {
          router.push("/admin/unauthorized");
        } else {
          setHasAccess(true);
        }
      });
    }
  }, [hasRole, isLoading, requiredRole, router]);

  return { hasAccess, isLoading };
}
