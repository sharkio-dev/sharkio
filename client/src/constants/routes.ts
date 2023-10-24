export const routes = {
  LOGIN: "/login",
  SIGNUP: "/signup",
  SERVICE_REQUEST: "/service/:serviceId/request/:id",
  REQUEST_INVOCATION:
    "/service/:serviceId/request/:requestId/invocation/:invocationId",
  COLLECTION_REQUEST: "/collection/:collectionId/request/:requestId",
  REQUESTS: "/requests",
  HOME: "/home",
  CONFIG: "/config",
  API_KEYS: "/api-keys",
  MOCKS: "/mocks",
  SERVICE: "/service/:port",
  OPENAPI: "/gen-openapi",
  COLLECTION: "/collections",
};
