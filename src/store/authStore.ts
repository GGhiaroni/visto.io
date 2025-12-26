import { AuthError, type User } from "@supabase/supabase-js";
import { create } from "zustand";
import { supabase } from "../lib/supabase";

interface AuthStore {
  user: User | null;
  loading: boolean;
  checkUser: () => Promise<void>;
  loginWithPassword: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  registerWithPassword: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,

  checkUser: async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      set({ user: session?.user || null, loading: false });

      supabase.auth.onAuthStateChange((_event, session) => {
        set({ user: session?.user || null, loading: false });
      });
    } catch (error) {
      console.error("Erro ao verificar o usuário:", error);
      set({ loading: false });
    }
  },

  loginWithPassword: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  },

  registerWithPassword: async (email, password) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { error };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));
