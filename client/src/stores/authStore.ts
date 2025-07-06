import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BackendAxios } from "../api/backendAxios";

export interface User {
  id: string;
  fullName: string;
  email: string;
  profileImg: string;
}

interface AuthState {
  user: User | null;
  signIn: (userData: User) => void;
  signOut: () => void;
}

const postSignIn = (userData: User) => {
  return BackendAxios.post("/sync-user", userData);
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      signIn: (userData) => {
        postSignIn(userData);
        set({ user: userData });
      },
      signOut: () => set({ user: null }),
    }),
    {
      name: "auth-storage", // key in localStorage
      storage: {
        getItem: (key) => {
          const item = localStorage.getItem(key);
          return item ? JSON.parse(item) : null;
        },
        setItem: (key, value) => {
          localStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: (key) => {
          localStorage.removeItem(key);
        },
      },
    }
  )
);