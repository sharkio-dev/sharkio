import { create } from "zustand";
import { User } from "../models/userModel";

interface authState {
  user: User | null;
  signIn: (userData: User) => void;
  signOut: () => void;
}

export const useAuthStore = create<authState>((set) => ({
  user: null,
  signIn: (userData) => set({ user: userData }),
  signOut: () => set({ user: null }),
}));
