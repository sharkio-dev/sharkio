import parse, { ResultJSON } from "@bany/curl-to-json";
import { EndpointService } from "../endpoint/endpoint.service";
export interface APIKeyAuth {
  type: string;
  in: string;
  name: string;
}

export interface SecuritySchemes {
  ApiKeyAuth: APIKeyAuth;
}

export interface Server {
  url: string;
  description?: string;
}
export interface Components {
  securitySchemes: SecuritySchemes;
}
export interface Security {
  ApiKeyAuth: any[];
}
export interface Info {
  title: string;
  version: string;
}
export interface PathObject {
  [key: "get" | "post" | "put" | "patch" | "delete" | string]: Object;
}

export interface Paths {
  [key: string]: PathObject;
}

export interface Swagger {
  openapi: string;
  info: Info;
  servers: Server[];
  components: Components;
  security: Security[];
  paths: Paths;
  tags: any[];
}

export class ImportService {
  constructor(private readonly endpointService: EndpointService) {}

  async importFromCurl(
    ownerId: string,
    snifferId: string,
    curlCommand: string,
  ) {
    const curlObject: ResultJSON = parse(curlCommand);
    const url = new URL(curlObject.url);

    const newEndpoint = await this.endpointService.create(
      url.pathname,
      curlObject.method ?? "GET",
      curlObject.header ?? {},
      curlObject.data,
      snifferId,
      ownerId,
    );

    return newEndpoint;
  }

  async importFromSwagger(
    ownerId: string,
    snifferId: string,
    swagger: Swagger,
  ) {
    const newEndpoints = Object.keys(swagger.paths).flatMap((path) => {
      return Object.keys(swagger.paths[path]).map((method) => {
        return this.endpointService.create(
          path,
          method,
          {},
          "",
          snifferId,
          ownerId,
        );
      });
    });

    return Promise.all(newEndpoints);
  }
}
