export interface OpenAPIDocument {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
  };
  paths: {
    [path: string]: {
      [method: string]: OpenAPIOperation;
    };
  };
}

export interface OpenAPIOperation {
  summary?: string;
  description?: string;
  requestBody?: OpenAPIRequestBody;
  responses?: {
    [statusCode: string]: OpenAPIResponse;
  };
}

export interface OpenAPIRequestBody {
  content?: {
    [mediaType: string]: {
      schema?: object;
    };
  };
}

export interface OpenAPIResponse {
  description?: string;
  content?: {
    [mediaType: string]: {
      schema?: object;
    };
  };
}
