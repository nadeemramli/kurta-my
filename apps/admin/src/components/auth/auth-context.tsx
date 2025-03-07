"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Auth, AuthUser, AdminRole } from "@kurta-my/auth";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const auth = new Auth({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
});

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
  const supabase = createClientComponentClient();

  const checkAdminAccess = (user: AuthUser) => {
    const isAdmin = user.user_metadata?.isAdmin === true;
    const role = user.user_metadata?.role;
    return { isAdmin, role };
  };

  useEffect(() => {
    // Check for existing session
    auth.getSession().then(async (session) => {
      if (session) {
        const user = await auth.getUser();
        if (user) {
          const { isAdmin, role } = checkAdminAccess(user);
          if (isAdmin && role) {
            setUser(user);
            setRole(role);
          } else {
            router.push("/login");
          }
        }
      }
      setIsLoading(false);
    });

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = auth.onAuthStateChange(async (user) => {
      if (user) {
        const { isAdmin, role } = checkAdminAccess(user as AuthUser);
        if (isAdmin && role) {
          setUser(user as AuthUser);
          setRole(role);
        } else {
          setUser(null);
          setRole(null);
          router.push("/login");
        }
      } else {
        setUser(null);
        setRole(null);
        router.push("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const login = async (email: string, password: string) => {
    const { user } = await auth.signIn(email, password);

    if (user) {
      const { isAdmin, role } = checkAdminAccess(user as AuthUser);
      if (isAdmin && role) {
        setUser(user as AuthUser);
        setRole(role);
        router.push("/admin");
      } else {
        await auth.signOut();
        throw new Error("Unauthorized: Admin access only");
      }
    }
  };

  const logout = async () => {
    await auth.signOut();
    setUser(null);
    setRole(null);
    router.push("/login");
  };

  const hasRole = async (requiredRole: AdminRole) => {
    if (!user || !role) return false;
    return role === requiredRole;
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
