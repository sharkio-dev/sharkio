import { create } from "zustand";
import {
  activateMockAPI,
  createMockAPI,
  deactivateMockAPI,
  deleteMockAPI,
  deleteMockResponseAPI,
  editMockAPI,
  editMockResponseAPI,
  getMockAPI,
  getMocksAPI,
  patchMockSelectedResponseIdAPI,
  postMockResponseAPI,
} from "../api/api";

export interface MockResponse {
  id: string;
  name: string;
  body: string;
  headers: object;
  status: number;
  sequenceIndex: number;
}

export interface Mock {
  id: string;
  url: string;
  method: string;
  isActive: boolean;
  selectedResponseId: string;
  snifferId: string;
  createdAt: string;
  responseSelectionMethod: string;
  mockResponses: MockResponse[];
}

interface MockState {
  mocks: Mock[];
  loadingMocks: boolean;
  loadingNewMock: boolean;
  loadingEditMock: boolean;
  loadingDeleteMock: boolean;
  loadMocks: (snifferId: string) => Promise<Mock[]>;
  resetMocks: () => void;
  activateMock: (snifferId: string, mockId: string) => Promise<void>;
  deactivateMock: (snifferId: string, mockId: string) => Promise<void>;
  deleteMock: (snifferId: string, mockId: string) => Promise<void>;
  createMock: (
    snifferId: string,
    mock: Omit<Mock, "id">,
  ) => Promise<{ id: string }>;
  editMock: (
    snifferId: string,
    mockId: string,
    mock: Partial<Mock>,
  ) => Promise<void>;
  responsedOrder: () => void;
  patchSelectedResponseId: (
    mockId: string,
    mockResponseId: string,
  ) => Promise<any>;
}

export const useMockStore = create<MockState>((set, get) => ({
  mocks: [],
  loadingMocks: false,
  loadingNewMock: false,
  loadingDeleteMock: false,
  loadingEditMock: false,
  loadMocks: (snifferId) => {
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
      get().loadMocks(snifferId);
    });
  },
  deactivateMock: (snifferId: string, mockId: string) => {
    return deactivateMockAPI(mockId).then(() => {
      get().loadMocks(snifferId);
    });
  },
  deleteMock: (snifferId: string, mockId: string) => {
    set({ loadingDeleteMock: true });
    return deleteMockAPI(mockId)
      .then(() => {
        get().loadMocks(snifferId);
      })
      .finally(() => set({ loadingDeleteMock: false }));
  },
  createMock: (snifferId: string, mock: Omit<Mock, "id">) => {
    set({ loadingNewMock: true });
    return createMockAPI({ ...mock })
      .then((res: any) => {
        get().loadMocks(snifferId);
        return res;
      })
      .finally(() => set({ loadingNewMock: false }));
  },
  editMock: (snifferId: string, mockId: string, mock: Partial<Mock>) => {
    set({ loadingEditMock: true });
    return editMockAPI(mockId, mock)
      .then(() => {
        get().loadMocks(snifferId);
      })
      .finally(() => {
        set({ loadingEditMock: false });
      });
  },
  responsedOrder: () => {
    return;
  },

  patchSelectedResponseId: (mockId, mockResponseId) => {
    return patchMockSelectedResponseIdAPI(mockId, mockResponseId);
  },
}));

interface MockResponseState {
  mock?: Mock;
  loadingMock: boolean;
  mockResponses?: MockResponse[];
  loadMock: (mockId: string) => Promise<Mock>;
  resetMock: () => void;
  postMockResponse: (
    snifferId: string,
    mockId: string,
    mockResponse: Omit<MockResponse, "id">,
  ) => Promise<MockResponse>;
  editMockResponse: (
    mockResponseId: string,
    mockResponse: Partial<MockResponse>,
  ) => Promise<void>;
  deleteMockResponse: (mockResponseId: string) => Promise<string>;
}

export const useMockResponseStore = create<MockResponseState>((set) => ({
  mock: undefined,
  loadingMock: false,
  mockResponses: [],
  loadMock: (mockId) => {
    set({ loadingMock: true });
    return getMockAPI(mockId)
      .then((data) => {
        data.mockResponses = data.mockResponses?.sort(
          (a: MockResponse, b: MockResponse) =>
            a.sequenceIndex - b.sequenceIndex,
        );
        set({ mock: data || [] });
        return data || [];
      })
      .finally(() => set({ loadingMock: false }));
  },
  resetMock: () => set({ mock: {} as Mock, mockResponses: [] }),
  postMockResponse: (snifferId, mockId, mockResponse) => {
    return postMockResponseAPI({ snifferId, mockId, ...mockResponse }).then(
      (res) => {
        return res;
      },
    );
  },
  editMockResponse: (mockResponseId, mockResponse) => {
    return editMockResponseAPI(mockResponseId, mockResponse).then((data) => {
      return data;
    });
  },
  deleteMockResponse: (mockResponseId) => {
    return deleteMockResponseAPI(mockResponseId).then((data) => {
      return data;
    });
  },
}));
