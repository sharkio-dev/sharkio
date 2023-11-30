import { create } from "zustand";
import { getMocks } from "../api/api";

export interface Mock {
  id: string;
  name: string;
  url: string;
  body: string;
  headers: Record<string, string>;
  method: string;
  status: string;
  isActive: boolean;
}

interface MockState {
  mocks: Mock[];
  loadingMocks: boolean;
  loadMocks: (snifferId: string, force?: boolean) => Promise<Mock[]>;
  resetMocks: () => void;
}

export const useMockStore = create<MockState>((set, get) => ({
  mocks: [],
  loadingMocks: false,
  loadMocks: (snifferId, force = false) => {
    if (get().mocks.length && !force) {
      return Promise.resolve(get().mocks);
    }
    set({ loadingMocks: true });
    return getMocks()
      .then((res) => {
        set({ mocks: res.data });
        return res.data;
      })
      .finally(() => set({ loadingMocks: false }));
  },
  resetMocks: () => set({ mocks: [] }),
}));
