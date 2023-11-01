import { create } from "zustand";
import { getSniffers } from "../api/api";

export type Sniffer = {
  name: string;
  id: string;
  downstreamUrl: string;
  port: number;
};

interface SniffersState {
  sniffers: Sniffer[];
  loadSniffers: () => Promise<void>;
}

export const useSniffersStore = create<SniffersState>((set) => ({
  sniffers: [],
  loadSniffers: () => {
    return getSniffers().then((res) => set({ sniffers: res.data }));
  },
}));
