"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Auth, AuthUser } from "@kurta-my/auth";

const auth = new Auth({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
});

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    name?: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    auth.getSession().then((session) => {
      if (session) {
        auth.getUser().then((user) => {
          setUser(user);
        });
      }
      setIsLoading(false);
    });

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = auth.onAuthStateChange((user) => {
      setUser(user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { user } = await auth.signIn(email, password);
    setUser(user as AuthUser);
  };

  const logout = async () => {
    await auth.signOut();
    setUser(null);
  };

  const register = async (userData: {
    email: string;
    password: string;
    name?: string;
  }) => {
    const { user } = await auth.signUp(userData.email, userData.password, {
      name: userData.name,
    });
    setUser(user as AuthUser);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
