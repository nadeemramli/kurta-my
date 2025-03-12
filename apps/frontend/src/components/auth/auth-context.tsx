"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// Helper function to handle errors
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unknown error occurred";
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: {
    first_name: string;
    last_name: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function typedRouter(router: AppRouterInstance) {
  return {
    push: (path: string) => router.push(path),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = typedRouter(useRouter());
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState((prev) => ({
        ...prev,
        user: session?.user || null,
        loading: false,
      }));
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState((prev) => ({
        ...prev,
        user: session?.user || null,
        loading: false,
      }));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/account");
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: getErrorMessage(error),
      }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      router.push("/account/verify");
    } catch (error: unknown) {
      setState((prev) => ({
        ...prev,
        error: getErrorMessage(error),
      }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const signOut = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/");
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: getErrorMessage(error),
      }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/account/reset-password`,
      });
      if (error) throw error;
      router.push("/account/check-email");
    } catch (error: unknown) {
      setState((prev) => ({
        ...prev,
        error: getErrorMessage(error),
      }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const updateProfile = async (data: {
    first_name: string;
    last_name: string;
  }) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
        },
      });
      if (error) throw error;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: getErrorMessage(error),
      }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
