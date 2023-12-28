import { create } from "zustand";
import {
  activateMockAPI,
  createMockAPI,
  deactivateMockAPI,
  deleteMockAPI,
  editMockAPI,
  getMocksAPI,
} from "../api/api";

export interface MockResponse {
  id: string;
  name: string;
  body: string;
  headers: object;
  status: number;
}

export interface Mock {
  id: string;
  url: string;
  method: string;
  isActive: boolean;
  selectedResponseId: string;
  snifferId: string;
  createdAt: string;
  mockResponses?: MockResponse[];
}

interface MockState {
  mocks: Mock[];
  loadingMocks: boolean;
  loadingNewMock: boolean;
  loadingEditMock: boolean;
  loadingDeleteMock: boolean;
  loadMocks: (snifferId: string, force?: boolean) => Promise<Mock[]>;
  resetMocks: () => void;
  activateMock: (snifferId: string, mockId: string) => Promise<void>;
  deactivateMock: (snifferId: string, mockId: string) => Promise<void>;
  deleteMock: (snifferId: string, mockId: string) => Promise<void>;
  createMock: (
    snifferId: string,
    mock: Omit<Mock, "id">
  ) => Promise<{ id: string }>;
  editMock: (
    snifferId: string,
    mockId: string,
    mock: Partial<Mock>
  ) => Promise<void>;
  responsedOrder: () => void;
}

export const useMockStore = create<MockState>((set, get) => ({
  mocks: [],
  loadingMocks: false,
  loadingNewMock: false,
  loadingDeleteMock: false,
  loadingEditMock: false,
  loadMocks: (snifferId, force = false) => {
    if (get().mocks.length && !force) {
      return Promise.resolve(get().mocks);
    }
    set({ loadingMocks: true });
    return getMocksAPI(snifferId)
      .then((res) => {
        set({ mocks: res.data || [] });
        return res.data || [];
      })
      .finally(() => set({ loadingMocks: false }));
  },
  resetMocks: () => set({ mocks: [] }),
  activateMock: (snifferId: string, mockId: string) => {
    return activateMockAPI(mockId).then(() => {
      get().loadMocks(snifferId, true);
    });
  },
  deactivateMock: (snifferId: string, mockId: string) => {
    return deactivateMockAPI(mockId).then(() => {
      get().loadMocks(snifferId, true);
    });
  },
  deleteMock: (snifferId: string, mockId: string) => {
    set({ loadingDeleteMock: true });
    return deleteMockAPI(mockId)
      .then(() => {
        get().loadMocks(snifferId, true);
      })
      .finally(() => set({ loadingDeleteMock: false }));
  },
  createMock: (snifferId: string, mock: Omit<Mock, "id">) => {
    set({ loadingNewMock: true });
    return createMockAPI({ snifferId, ...mock })
      .then((res: any) => {
        get().loadMocks(snifferId, true);
        return res;
      })
      .finally(() => set({ loadingNewMock: false }));
  },
  editMock: (snifferId: string, mockId: string, mock: Partial<Mock>) => {
    set({ loadingEditMock: true });
    return editMockAPI(mockId, mock)
      .then(() => {
        get().loadMocks(snifferId, true);
      })
      .finally(() => {
        set({ loadingEditMock: false });
      });
  },
  responsedOrder: () => {
    return;
  },
}));

interface MockResponseState {
  mock?: Mock;
  loadingMock: boolean;
  mockResponses?: MockResponse[];
  loadingMockResponses: boolean;
  loadMock: (snifferId: string, mockId: string) => Promise<Mock>;
  resetMock: () => void;
  postMockResponse: (
    snifferId: string,
    mockId: string,
    mockResponse: Omit<MockResponse, "id">
  ) => Promise<{ id: string }>;
  editMockResponse: (
    snifferId: string,
    mockId: string,
    mockResponseId: string,
    mockResponse: Partial<MockResponse>
  ) => Promise<void>;
  deleteMockResponse: (
    snifferId: string,
    mockId: string,
    mockResponseId: string
  ) => Promise<void>;
}

export const useMockResponseStore = create<MockResponseState>((set, get) => ({
  mock: undefined,
  loadingMock: false,
  mockResponses: [],
  loadingMockResponses: false,
  loadMock: (snifferId, mockId) => {
    return;
  },
  resetMock: () => set({ mock: {} as Mock, mockResponses: [] }),
  postMockResponse: (snifferId, mockId, mockResponse) => {
    return;
  },
  editMockResponse: (snifferId, mockId, mockResponseId, mockResponse) => {
    return;
  },
  deleteMockResponse: (snifferId, mockId, mockResponseId) => {
    return;
  },
}));
