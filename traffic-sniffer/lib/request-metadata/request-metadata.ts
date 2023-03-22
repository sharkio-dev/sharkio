import { Request } from "express";
import { PathMetadata } from "./path-metadata";

export class RequestMetadata {
  private paths: Map<string, PathMetadata>;
  constructor() {
    this.paths = new Map();
  }

  extractMetadata(request: Request) {
    const { method, path } = request;
    const pathMetadata = this.getAndRegisterPath(path, method);
    pathMetadata.extractMetadata(request);
  }

  getAndRegisterPath(path: string, method: string) {
    let pathMetadata = this.paths.get(path);

    if (pathMetadata === undefined) {
      pathMetadata = new PathMetadata(method, path);
      this.paths.set(path, pathMetadata);
    }

    return pathMetadata;
  }

  printStatistics() {
    console.log(JSON.stringify(Array.from(this.paths.entries()), null, 2));
  }
}
