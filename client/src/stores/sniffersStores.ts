import { create } from "zustand";
import {
  createSniffer,
  deleteSniffer,
  editSniffer,
  getSniffers,
} from "../api/api";

export type SnifferType = {
  name: string;
  id: string;
  downstreamUrl: string;
  port: number;
  subdomain: string;
};

interface SniffersState {
  sniffers: SnifferType[];
  loadSniffers: () => Promise<SnifferType[]>;
  createSniffer: (sniffer: Omit<SnifferType, "id">) => Promise<void>;
  deleteSniffer: (snifferId: string) => Promise<void>;
  editSniffer: (sniffer: Partial<SnifferType>) => Promise<void>;
}

export const useSniffersStore = create<SniffersState>((set) => ({
  sniffers: [],
  loadSniffers: () => {
    return getSniffers().then((res) => {
      set({ sniffers: res.data });
      return res.data;
    });
  },
  createSniffer: (sniffer: Omit<SnifferType, "id">) => {
    return createSniffer(sniffer).then(() => {
      getSniffers().then((res) => set({ sniffers: res.data }));
    });
  },
  deleteSniffer: (snifferId: string) => {
    return deleteSniffer(snifferId).then(() => {
      getSniffers().then((res) => set({ sniffers: res.data }));
    });
  },
  editSniffer: (sniffer: Partial<SnifferType>) => {
    return editSniffer(sniffer).then(() => {
      getSniffers().then((res) => set({ sniffers: res.data }));
    });
  },
}));
