import { OpenAPIDocument, OpenAPIOperation, OpenAPIResponse } from "./openapi.interface";

export function jsonSchemaToOpenapi(request: any) {
  const openAPIDocument: OpenAPIDocument = {
    openapi: "3.0.0",
    info: {
      title: "API",
      version: "1.0.0",
      description: ""
    },
    paths: {}
  }

  openAPIDocument.paths[request.url] = {};

  const operation: OpenAPIOperation = {
    summary: `Endpoint for ${request.method}`,
    responses: {},
  };

  openAPIDocument.paths[request.url][request.method.toLowerCase()] = operation;  
  
  return JSON.stringify(openAPIDocument,null, 2);
}
