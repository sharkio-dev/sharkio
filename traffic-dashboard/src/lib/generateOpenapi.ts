import { OpenAPIDocument, OpenAPIOperation } from "./openapi.interface";

export function JsonToOpenapi(
  requests: unknown[],
  apiName: string,
  apiVersion: string
) {
  const openApiDocument: OpenAPIDocument = {
    openapi: "3.0.0",
    info: {
      title: apiName,
      version: apiVersion,
      description: "",
    },
    paths: {},
  };

  handleRequests(openApiDocument, requests);

  return openApiDocument;
}

function handleRequests(openApiDocument: OpenAPIDocument, requests: unknown[]) {
  requests.forEach((request: any) => {
    const { url, method, invocations } = request;

    if (!openApiDocument.paths[url]) {
      openApiDocument.paths[url] = {};
    }

    const operation: OpenAPIOperation = {
      summary: `Endpoint for ${method}`,
      requestBody: invocations[0].body,
      responses: {},
    };

    openApiDocument.paths[url][method.toLowerCase()] = operation;
  });
}
