import { Request } from "express";
import { PathMetadata } from "./path-metadata";
import { Invocation, PathResponseData } from "../../types/types";

// This class only represents a mapping from the URL to the Methods we run on it
// It's empty as heck and we can merge it with PathMetadata instead
// All of the functionality is being delegated to the PathMetadata class
export class RequestMetadata {
  private paths: Map<string, Map<string, PathMetadata>>;

  constructor() {
    this.paths = new Map();
  }

  private ensureRequestMetadata(path: string) {
    let pathMetadata = this.paths.get(path);

    if (pathMetadata === undefined) {
      pathMetadata = new Map<string, PathMetadata>();
      this.paths.set(path, pathMetadata);
    }

    return pathMetadata;
  }

  private ensureMethodMetadata(
    pathMetadata: Map<string, PathMetadata>,
    method: string,
    url: string,
    service: string
  ) {
    let methodMetadata = pathMetadata.get(method);

    if (methodMetadata === undefined) {
      methodMetadata = new PathMetadata(method, url, service);
      pathMetadata.set(method, methodMetadata);
    }

    return methodMetadata;
  }

  interceptRequest(request: Request, service: string) {
    const { method, path } = request;
    const pathMetadata = this.ensureRequestMetadata(path);
    const methodMetadata = this.ensureMethodMetadata(
      pathMetadata,
      method,
      path,
      service
    );
    methodMetadata.interceptRequest(request);
  }

  execute(url: string, method: string, invocation: Invocation, service: string) {
    const pathMetadata = this.ensureRequestMetadata(url);
    const methodMetadata = this.ensureMethodMetadata(pathMetadata, method, url, service);

    return methodMetadata.execute(invocation);
  }

  stats(): PathResponseData[] {
    const result: PathResponseData[] = [];

    for (const [path, methodMap] of this.paths) {
      for (const [method, methodMetadata] of methodMap) {
        result.push(methodMetadata.stats());
      }
    }

    // WTF is even that?
    // return Object.keys(result).map((key: any) => result[key]);
    return result;
  }

  invalidate() {
    this.paths = new Map();
  }
}
