import { InterceptedRequest, Invocation } from "../types/types";
import {
  OpenAPIDocument,
  OpenAPIOperation,
  OpenAPIRequestBody,
} from "./openapi.interface";

export function JsonToOpenapi(
  requests: InterceptedRequest[],
  apiName = "",
  apiVersion = "",
  description = "",
) {
  const openApiDocument: OpenAPIDocument = {
    openapi: "3.0.0",
    info: {
      title: apiName,
      version: apiVersion,
      description,
    },
    paths: {},
  };

  handleRequests(openApiDocument, requests);

  return openApiDocument;
}

function handleRequests(
  openApiDocument: OpenAPIDocument,
  requests: InterceptedRequest[],
) {
  requests.forEach((request) => {
    const { url, method, invocations } = request;

    if (!openApiDocument.paths[url]) {
      openApiDocument.paths[url] = {};
    }

    const operation = createOperation(method, invocations);

    openApiDocument.paths[url][method.toLowerCase()] = operation;
  });
}

function createOperation(method: string, invocations: Invocation[]) {
  const operation: OpenAPIOperation = {
    summary: `Endpoint for ${method}`,
    responses: {
      "200": { description: "Successful operation" },
    },
  };
  if (method !== "GET") {
    operation.requestBody = createBody(invocations[0].body!);
  }
  return operation;
}

function createBody(invocation: Record<string, string>) {
  const arr = parseRequestBodyItems(invocation);
  const requestBody: OpenAPIRequestBody = {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: arr,
        },
      },
    },
  };
  return requestBody;
}

function parseRequestBodyItems(body: Record<string, string>) {
  const arr: Record<string, { type: string }> = {};
  const keys = Object.keys(body);
  const values = Object.values(body);
  keys.forEach((prop, index) => {
    arr[prop] = { type: typeof values[index] };
  });
  return arr;
}
