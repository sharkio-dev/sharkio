import { create } from "zustand";
import {
  createSniffer,
  deleteSniffer,
  editSniffer,
  getSniffers,
} from "../api/api";

export type Sniffer = {
  name: string;
  id: string;
  downstreamUrl: string;
  port: number;
  subdomain: string;
};

interface SniffersState {
  sniffers: Sniffer[];
  loadSniffers: () => Promise<void>;
  createSniffer: (
    sniffer: Omit<Omit<Sniffer, "id">, "subdomain">
  ) => Promise<void>;
  deleteSniffer: (snifferId: string) => Promise<void>;
  editSniffer: (sniffer: Partial<Omit<Sniffer, "subdomain">>) => Promise<void>;
}

export const useSniffersStore = create<SniffersState>((set) => ({
  sniffers: [],
  loadSniffers: () => {
    return getSniffers().then((res) => set({ sniffers: res.data }));
  },
  createSniffer: (sniffer: Omit<Omit<Sniffer, "id">, "subdomain">) => {
    return createSniffer(sniffer).then(() => {
      getSniffers().then((res) => set({ sniffers: res.data }));
    });
  },
  deleteSniffer: (snifferId: string) => {
    return deleteSniffer(snifferId).then(() => {
      getSniffers().then((res) => set({ sniffers: res.data }));
    });
  },
  editSniffer: (sniffer: Partial<Omit<Sniffer, "subdomain">>) => {
    return editSniffer(sniffer).then(() => {
      getSniffers().then((res) => set({ sniffers: res.data }));
    });
  },
}));
