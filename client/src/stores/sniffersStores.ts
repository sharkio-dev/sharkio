import { create } from "zustand";
import {
  createSniffer,
  deleteSniffer,
  editSniffer,
  getEnpoints,
  getInvocations,
  getLiveInvocations,
  getSniffers,
} from "../api/api";
import { EndpointType, InvocationType } from "../pages/sniffers/types";
import { executeInvocationAPI } from "../api/api";
import { Invocation } from "../types/types";

export type SnifferType = {
  name: string;
  id: string;
  downstreamUrl: string;
  port: number;
  subdomain: string;
};

interface SniffersState {
  sniffers: SnifferType[];
  selectedSniffer: SnifferType | null;
  endpoints: EndpointType[];
  endpointsCache: Record<string, EndpointType[]>;
  invocations: InvocationType[];
  invocationCache: Record<string, InvocationType[]>;
  loadingInvocations: boolean;
  loadingSniffers: boolean;
  loadingEndpoints: boolean;
  loadingExecution: boolean;
  loadSniffers: (force?: boolean) => Promise<SnifferType[]>;
  setSelectedSniffer: (sniffer: SnifferType | null) => void;
  createSniffer: (sniffer: Omit<SnifferType, "id">) => Promise<any>;
  deleteSniffer: (snifferId: string) => Promise<void>;
  editSniffer: (sniffer: Partial<SnifferType>) => Promise<void>;
  loadEndpoints: (
    snifferId: string,
    force?: boolean,
  ) => Promise<EndpointType[]>;
  resetEndpoints: () => void;
  loadInvocations: (
    endpointId: string,
    force?: boolean,
  ) => Promise<InvocationType[]>;
  resetInvocations: () => void;
  setInvocation: (invocation: InvocationType) => void;
  loadLiveInvocations: () => Promise<InvocationType[]>;
  executeInvocation: (data: {
    testId?: string;
    snifferId: string;
    url: string;
    method: string;
    headers: Record<string, string>;
    body: string;
    endpointId?: string;
  }) => Promise<any>;
}

export const useSniffersStore = create<SniffersState>((set, get) => ({
  sniffers: [],
  selectedSniffer: null,
  endpoints: [],
  endpointsCache: {},
  invocations: [],
  invocationCache: {},
  loadingInvocations: false,
  loadingSniffers: false,
  loadingEndpoints: false,
  loadingExecution: false,
  loadSniffers: (force = false) => {
    if (get().sniffers.length && !force) {
      return Promise.resolve(get().sniffers);
    }

    set({ loadingSniffers: true });
    return getSniffers()
      .then((res) => {
        set({ sniffers: res.data || [] });
        return res.data;
      })
      .finally(() => set({ loadingSniffers: false }));
  },
  setSelectedSniffer: (sniffer: SnifferType | null) => {
    set({ selectedSniffer: sniffer });
  },
  createSniffer: (sniffer: Omit<SnifferType, "id">) => {
    return createSniffer(sniffer).then((res) => {
      get()
        .loadSniffers(true)
        .then((res) => set({ sniffers: res }));

      return res;
    });
  },
  deleteSniffer: (snifferId: string) => {
    return deleteSniffer(snifferId).then(() => {
      get()
        .loadSniffers(true)
        .then((res) => set({ sniffers: res }));
    });
  },
  editSniffer: (sniffer: Partial<SnifferType>) => {
    return editSniffer(sniffer).then(() => {
      get()
        .loadSniffers(true)
        .then((res) => set({ sniffers: res }));
    });
  },
  loadEndpoints: (snifferId: string, force = false) => {
    if (get().endpointsCache[snifferId] && !force) {
      set({ endpoints: get().endpointsCache[snifferId] });
      return Promise.resolve(get().endpointsCache[snifferId]);
    }
    set({ loadingEndpoints: true });
    return getEnpoints(snifferId)
      .then((res) => {
        set({
          endpoints: res || [],
          endpointsCache: { ...get().endpointsCache, [snifferId]: res },
        });
        return res;
      })
      .finally(() => set({ loadingEndpoints: false }));
  },
  resetEndpoints: () => {
    set({ endpoints: [] });
  },
  loadInvocations: (endpointId: string, force = false) => {
    if (get().invocationCache[endpointId] && !force) {
      set({ invocations: get().invocationCache[endpointId] });
      return Promise.resolve(get().invocationCache[endpointId]);
    }
    set({ loadingInvocations: true });
    return getInvocations(endpointId)
      .then((res) => {
        set({
          invocations: res || [],
          invocationCache: { ...get().invocationCache, [endpointId]: res },
        });
        return res;
      })
      .finally(() => set({ loadingInvocations: false }));
  },
  setInvocation: (invocation: InvocationType) => {
    let newInvocations: InvocationType[] = [];
    set((state) => {
      newInvocations = [...state.invocations];
      const invocationIndex = state.invocations.findIndex(
        (i) => i.id === invocation.id,
      );
      if (invocationIndex > 0) {
        newInvocations[invocationIndex] = invocation;
      }
      return { ...state, invocations: newInvocations };
    });
    set({
      invocationCache: {
        ...get().invocationCache,
        [invocation.endpointId]: newInvocations,
      },
    });
  },
  resetInvocations: () => {
    set({ invocations: [] });
  },
  loadLiveInvocations: () => {
    set({ loadingInvocations: true });
    return getLiveInvocations()
      .then((res) => {
        set({ invocations: res });
        return res;
      })
      .finally(() => {
        set({ loadingInvocations: false });
      });
  },
  executeInvocation: (data: {
    testId?: string;
    snifferId: string;
    url: string;
    method: string;
    headers: Record<string, string>;
    body: string;
    endpointId?: string;
  }) => {
    set({ loadingExecution: true });
    return executeInvocationAPI({
      testId: data.testId,
      snifferId: data.snifferId,
      url: data.url,
      method: data.method,
      headers: data.headers,
      body: data.body,
    })
      .then((res) => {
        get().loadEndpoints(data.snifferId, true);
        return res;
      })
      .finally(() => {
        set({ loadingExecution: false });
      });
  },
}));
