import { create } from "zustand";

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
}

interface AuthStore {
  user: UserProfile | null;
  isLoading: boolean;
  setUser: (user: UserProfile | null) => void;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) => set({ user, isLoading: false }),

  fetchUser: async () => {
    try {
      set({ isLoading: true });
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        set({ user: data.user, isLoading: false });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch (error) {
      set({ user: null, isLoading: false });
    }
  },

  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      set({ user: null });
    } catch (error) {
      console.error("Logout failed", error);
    }
  },
}));
