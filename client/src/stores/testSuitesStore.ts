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
  createTestSuite: (name: string) => Promise<void>;
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
    return postTestSuite(name).then(() => {
      get().loadTestSuites();
    });
  },
}));
