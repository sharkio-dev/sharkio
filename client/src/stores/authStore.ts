import { create } from "zustand";

export interface User {
  id: string;
  fullName: string;
  email: string;
  profileImg: string;
}

interface authState {
  user: User | null;
  signIn: (userData: User) => void;
  signOut: () => void;
}

export const useAuthStore = create<authState>((set) => ({
  user: null,
  signIn: (userData) => set({ user: { ...userData } }),
  signOut: () => set({ user: null }),
}));
