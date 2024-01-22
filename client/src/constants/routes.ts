export const routes = {
  ROOT: "/",
  LOGIN: "/login",

  PROXIES: "/proxies",
  PROXY_CREATE: "/proxies/create",

  LIVE_INVOCATIONS: "/live-invocations",
  LIVE_INVOCATION: "/live-invocations/:invocationId",

  ENDPOINTS: "/endpoints",
  ENDPOINT: "/endpoints/:endpointId",
  ENDPOINTS_INVOCATION: "/endpoints/:endpointId/invocations/:invocationId",
  CREATE_ENDPOINT: "/endpoints/create",

  API_KEYS: "/api-keys",

  DOCS_GETTING_STARTED: "/docs/getting-started",
  DOCS_SETUP: "/docs/setup",
  CHAT: "/chat",

  TEST_SUITES: "/test-suites",
  TEST_SUITE: "/test-suites/:testSuiteId",
  TEST_ENDPOINT: "/test-suites/:testSuiteId/tests/:testId",
  TEST_SUITE_TEST: "/test-suites/:testSuiteId/tests/:testId",

  MOCKS: "/mocks",
  MOCK: "/mocks/:mockId",

  JOIN_WORKSPACE: "/join/:workspaceId",
};
