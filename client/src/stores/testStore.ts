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
  body: Record<string, any>;
  headers: Record<string, any>;
  method: string;
  rules: Rule[];
};

export const deleteTest = (testId: string) => {
  return BackendAxios.delete(`/test-suites/${testId}`);
};

export const getTestByTestSuiteId = (testSuiteId: string) => {
  return BackendAxios.get(`/test-suites/${testSuiteId}/tests`);
};

export const getTestById = (testSuiteId: string, testId: string) => {
  return BackendAxios.get(`/test-suites/${testSuiteId}/tests/${testId}`);
};

export const getTest = (testSuiteId: string, testId: string) => {
  return BackendAxios.get<TestType>(
    `/test-suites/${testSuiteId}/tests/${testId}`,
  );
};
