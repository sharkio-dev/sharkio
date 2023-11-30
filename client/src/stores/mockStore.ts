import { create } from "zustand";
import { getMocks } from "../api/api";

export interface Mock {
  id: number;
  name: string;
  url: string;
  method: string;
  response: string;
  status: number;
  delay: number;
  active: boolean;
}

interface MockState {
  mocks: Mock[];
  loadingMocks: boolean;
  loadMocks: (snifferId: string, force?: boolean) => Promise<Mock[]>;
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
}));
