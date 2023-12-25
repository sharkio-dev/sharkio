import { create } from "zustand";
import { BackendAxios } from "../api/backendAxios";

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

const postSignIn = (userData: User) => {
  return BackendAxios.post("/sync-user", { ...userData });
};

export const useAuthStore = create<authState>((set) => ({
  user: null,
  signIn: (userData) => {
    postSignIn(userData);
    set({ user: { ...userData } });
  },
  signOut: () => set({ user: null }),
}));
