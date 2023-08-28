import { create } from "zustand";

interface themeStore {
  mode: "light" | "dark";
  toggleColorMode: () => void;
}

export const useThemeStore = create<themeStore>((set) => ({
  mode: "light",
  toggleColorMode: () => {
    set((state) => ({
      mode: state.mode === "light" ? "dark" : "light",
    }));
  },
}));
