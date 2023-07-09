import {
  OpenAPIDocument,
  OpenAPIOperation,
  OpenAPIResponse,
} from "./openapi.interface";

export function JsonToOpenapi(requests: unknown[], apiName: string, apiVersion: string) {
  const openApiDocument: OpenAPIDocument = {
    openapi: "3.0.0",
    info: {
      title: apiName,
      version: apiVersion,
      description: "",
    },
    paths: {},
  };

  handleRequests(openApiDocument, requests)

  return openApiDocument;
}

function handleRequests(openApiDocument: OpenAPIDocument, requests: unknown[]) {
  requests.forEach((request: any) => {
    console.log(request)
    const { url, method, invocations } = request;

    if (!openApiDocument.paths[url]) {
      openApiDocument.paths[url] = {};
    }

    const operation: OpenAPIOperation = {
      summary: `Endpoint for ${method}`,
      responses: {},
    };

    const response: OpenAPIResponse = {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/ResponseData',
            },
          },
        },
      },
    };

    //operation.responses['200'] = response;
    openApiDocument.paths[url][method.toLowerCase()] = operation;
  });
}