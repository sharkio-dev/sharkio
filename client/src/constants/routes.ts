export const routes = {
  LOGIN: "/login",
  SERVICE_REQUEST: "/service/:serviceId/request/:id",
  REQUEST_INVOCATION:
    "/service/:serviceId/request/:requestId/invocation/:invocationId",
  COLLECTION_REQUEST: "/collection/:collectionId/request/:requestId",
  HOME: "/home",
  SNIFFERS: "/sniffers",
  SNIFFER: "/sniffers/:snifferId",
  INVOCATION: "/sniffers/invocations/:invocationId",
  SNIFFER_ENDPOINT: "/sniffers/:snifferId/endpoints/:endpointId",
  SNIFFER_ENDPOINT_INVOCATION:
    "/sniffers/:snifferId/endpoints/:endpointId/invocations/:invocationId",
  API_KEYS: "/api-keys",
  MOCKS: "/mocks",
  SERVICE: "/service/:id",
  OPENAPI: "/gen-openapi",
  COLLECTION: "/collections",
  DOCS_GETTING_STARTED: "/docs/getting-started",
  DOCS_SETUP: "/docs/setup",
};
