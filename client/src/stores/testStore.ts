import { create } from "zustand";
import { BackendAxios } from "../api/backendAxios";

type RuleType = "status_code" | "body" | "header";
type RuleComparator = "equals";
export type Rule = {
  type: RuleType;
  comparator: RuleComparator;
  targetPath?: string;
  expectedValue: any;
};

export type TestType = {
  id: string;
  name: string;
  createdAt: Date;
  testSuiteId: string;
  url: string;
  body: string;
  headers: Record<string, any>;
  method: string;
  rules: Rule[];
};

export const getTestByTestSuiteId = (testSuiteId: string) => {
  return BackendAxios.get(`/test-suites/${testSuiteId}/tests`);
};
interface TestStore {
  tests: Record<string, TestType[]>;
  executedTests: Record<string, boolean>;
  executions: any[];
  loadTests: (testSuiteId: string) => Promise<TestType[]>;
  createTest: (testSuiteId: string, test: TestType) => Promise<any>;
  deleteTest: (testSuiteId: string, testId: string) => Promise<void>;
  editTest: (
    testSuiteId: string,
    testId: string,
    test: TestType
  ) => Promise<void>;
  importTest: (
    testSuiteId: string,
    invocationId: string,
    name: string
  ) => Promise<void>;
  getTest: (testSuiteId: string, testId: string) => Promise<TestType>;
  resetTests: () => void;
  executeTest: (testSuiteId: string, testId: string) => Promise<void>;
  getExecutions: (testSuiteId: string, testId: string) => Promise<any>;
  getExecutionByEndpoint: (testSuiteId: string, url: string) => Promise<any>;
  currentTest: TestType;
  setCurrentTest: (test: TestType) => void;
  getRule: (ruleType: string) => Rule | undefined;
}

export const useTestStore = create<TestStore>((set, get) => ({
  tests: {},
  executedTests: {},
  executions: [],
  currentTest: {
    id: "",
    name: "",
    createdAt: new Date(),
    testSuiteId: "",
    url: "",
    body: "",
    headers: {},
    method: "",
    rules: [],
  },

  getRule: (ruleType: string) => {
    const rules = get().currentTest.rules;
    return rules.find((rule) => rule.type === ruleType);
  },

  setCurrentTest: (test: TestType) => {
    set({ currentTest: test });
  },
  loadTests: async (testSuiteId: string) => {
    return getTestByTestSuiteId(testSuiteId).then((res) => {
      const a = res?.data?.reduce(
        (acc: Record<string, TestType[]>, test: TestType) => {
          const url = test.url;
          if (Object.hasOwnProperty.call(acc, url)) {
            acc[url] = [...acc[url], test];
          } else {
            acc[url] = [test];
          }
          return acc;
        },
        {}
      );
      set({ tests: a });
      return res.data;
    });
  },
  createTest: async (testSuiteId: string, test: TestType) => {
    return BackendAxios.post(`/test-suites/${testSuiteId}/tests`, test).then(
      (res) => {
        get().loadTests(testSuiteId);
        return res.data;
      }
    );
  },
  editTest: async (testSuiteId: string, testId: string, test: TestType) => {
    return BackendAxios.put(`/test-suites/${testSuiteId}/tests/${testId}`, {
      name: test?.name,
      headers: test?.headers,
      body: test?.body,
      url: test?.url,
      method: test?.method,
      rules: test?.rules,
    }).then((res) => {
      get().loadTests(testSuiteId);
      return res.data;
    });
  },

  importTest: async (
    testSuiteId: string,
    invocationId: string,
    name: string
  ) => {
    return BackendAxios.post(
      `/test-suites/${testSuiteId}/import/${invocationId}`,
      {
        name,
      }
    ).then((res) => {
      get().loadTests(testSuiteId);
      return res.data;
    });
  },
  deleteTest: async (testSuiteId: string, testId: string) => {
    return BackendAxios.delete(
      `/test-suites/${testSuiteId}/tests/${testId}`
    ).then(() => {
      get().loadTests(testSuiteId);
    });
  },
  getTest: async (testSuiteId: string, testId: string) => {
    return BackendAxios.get<TestType>(
      `/test-suites/${testSuiteId}/tests/${testId}`
    ).then((res) => {
      set({ currentTest: res.data });
      return res.data;
    });
  },

  resetTests: () => {
    set({ tests: {} });
  },
  executeTest: async (testSuiteId: string, testId: string) => {
    set((state) => ({
      ...state,
      executedTests: {
        ...state.executedTests,
        [testId]: true,
      },
    }));
    return BackendAxios.post(
      "/test-suites/" + testSuiteId + "/tests/" + testId + "/run"
    )
      .finally(() => {
        set((state) => ({
          ...state,
          executedTests: {
            ...state.executedTests,
            [testId]: false,
          },
        }));
      })
      .then((res) => {
        return res.data;
      });
  },
  getExecutions: async (testSuiteId: string, testId: string) => {
    set((state) => ({
      ...state,
      executions: [],
    }));
    return BackendAxios.get(
      `/test-suites/${testSuiteId}/tests/${testId}/test-executions`
    ).then((res) => {
      set((state) => ({
        ...state,
        executions: res.data,
      }));
      return res.data;
    });
  },
  getExecutionByEndpoint: async (testSuiteId: string, url: string) => {
    set((state) => ({
      ...state,
      executions: [],
    }));
    return BackendAxios.get(`/test-suites/${testSuiteId}/test-executions`, {
      params: {
        url,
      },
    }).then((res) => {
      set((state) => ({
        ...state,
        executions: res.data,
      }));
      return res.data;
    });
  },
}));
