import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface themeStore {
  mode: "light" | "dark";
  toggleColorMode: () => void;
}

export const useThemeStore = create<themeStore>()(
  persist(
    (set, get) => ({
      mode: "dark",
      toggleColorMode: () => {
        set((state) => ({
          mode: state.mode === "light" ? "dark" : "light",
        }));
      },
    }),
    {
      name: "theme-mode",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
