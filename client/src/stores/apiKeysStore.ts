import { create } from "zustand";
import { deleteKey, editKey, getKeys, postKey } from "../api/apiKeys";

type ApiKey = {
  name: string;
  id: string;
  key: string;
};

interface ApiKeysState {
  keys: ApiKey[];
  loadApiKeys: () => Promise<void>;
  addKey: (apiKey: string) => Promise<any>;
  deleteKey: (apiKey: string) => Promise<void>;
  updateKey: (apiKey: string, name: string) => Promise<void>;
}

export const useApiKeysStore = create<ApiKeysState>((set) => ({
  keys: [],
  loadApiKeys: () => {
    return getKeys().then((res) => set({ keys: res.data }));
  },
  addKey: (apiKey: string) => {
    return postKey(apiKey).then((res) => {
      getKeys().then((res) => set({ keys: res.data }));
      return res;
    });
  },
  deleteKey: (apiKeyId: string) => {
    return deleteKey(apiKeyId).then(() => {
      getKeys().then((res) => set({ keys: res.data }));
      return;
    });
  },
  updateKey: (apiKeyId: string, name: string) => {
    return editKey(apiKeyId, name).then(async () => {
      getKeys().then((res) => set({ keys: res.data }));
    });
  },
}));
