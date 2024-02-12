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

  FLOWS: "/flows",
  FLOW: "/flows/:flowId",
  FLOW_TEST: "/flows/:flowId/tests/:testId",
  FLOW_RUN: "/flows/:flowId/runs/:runId",

  MOCKS: "/mocks",
  MOCK: "/mocks/:mockId",

  JOIN_WORKSPACE: "/join/:workspaceId",
};
