import { InterceptedRequest } from "../types/types";
import { OpenAPIDocument, OpenAPIOperation } from "./openapi.interface";

export function JsonToOpenapi(
  requests: InterceptedRequest[],
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

function handleRequests(
  openApiDocument: OpenAPIDocument,
  requests: InterceptedRequest[]
) {
  requests.forEach((request) => {
    const { url, method, invocations } = request;

    if (!openApiDocument.paths[url]) {
      openApiDocument.paths[url] = {};
    }

    const operation: OpenAPIOperation = {
      summary: `Endpoint for ${method}`,
      requestBody: invocations[0].body!,
      responses: {},
    };

    openApiDocument.paths[url][method.toLowerCase()] = operation;
  });
}
