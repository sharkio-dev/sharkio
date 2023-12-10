export const routes = {
  RESET_PASSWORD: "/reset-password",
  LOGIN: "/login",
  COLLECTION_REQUEST: "/collection/:collectionId/request/:requestId",
  LIVE: "/live",
  LIVE_INVOCATION: "/live/invocations/:invocationId",
  SNIFFERS: "/sniffers",
  SNIFFER: "/sniffers/:snifferId",
  SNIFFER_CREATE_INVOCATION: "/sniffers/:snifferId/invocations/create",
  SNIFFER_ENDPOINT: "/sniffers/:snifferId/endpoints/:endpointId",
  SNIFFER_ENDPOINT_INVOCATION:
    "/sniffers/:snifferId/endpoints/:endpointId/invocations/:invocationId",
  API_KEYS: "/api-keys",
  DOCS_GETTING_STARTED: "/docs/getting-started",
  DOCS_SETUP: "/docs/setup",
  CHAT: "/chat",
  TEST_SUITES: "/test-suites",
  TEST_SUITE: "/test-suites/:testSuiteId",
  TEST_ENDPOINT: "/test-suites/:testSuiteId/endpoints/:endpointId",
  TEST_SUITE_TEST:
    "/test-suites/:testSuiteId/endpoints/:endpointId/tests/:testId",
  MOCKS: "/mocks",
  MOCK: "/mocks/:mockId",
};
