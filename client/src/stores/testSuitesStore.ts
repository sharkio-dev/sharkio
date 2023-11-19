import { create } from "zustand";
import { BackendAxios } from "../api/backendAxios";

const getTestSuites = async () => {
  return BackendAxios.get("/test-suites");
};

const postTestSuite = async (name: string) => {
  return BackendAxios.post("/test-suites", { name });
};

type TestSuiteType = {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
};

interface TestSuiteStore {
  testSuites: TestSuiteType[];
  loadTestSuites: () => Promise<TestSuiteType[]>;
  createTestSuite: (name: string) => Promise<any>;
  editTestSuite: (id: string, name: string) => Promise<void>;
  deleteTestSuite: (id: string) => Promise<void>;
}

export const useTestSuiteStore = create<TestSuiteStore>((set, get) => ({
  testSuites: [],
  loadTestSuites: async () => {
    return getTestSuites().then((res) => {
      set({ testSuites: res.data });
      return res.data;
    });
  },
  createTestSuite: async (name: string) => {
    return postTestSuite(name).then((res) => {
      get().loadTestSuites();
      return res.data;
    });
  },
  editTestSuite: async (id: string, name: string) => {
    return BackendAxios.put(`/test-suites/${id}`, { name }).then(() => {
      get().loadTestSuites();
    });
  },
  deleteTestSuite: async (id: string) => {
    return BackendAxios.delete(`/test-suites/${id}`).then(() => {
      get().loadTestSuites();
    });
  },
}));
