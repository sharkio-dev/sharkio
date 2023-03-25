import axios from "axios";
import { Request } from "express";
import { Invocation, PathMetadata } from "./path-metadata";

export class RequestMetadata {
  private paths: Map<string, Map<string, PathMetadata>>;

  constructor() {
    this.paths = new Map();
  }

  extractMetadata(request: Request) {
    const { method, path } = request;
    const pathMetadata = this.getAndRegisterPath(path);
    const methodMetadata = this.getAndRegisterMethod(
      pathMetadata,
      method,
      path
    );
    methodMetadata.extractMetadata(request);
  }

  private getAndRegisterPath(path: string) {
    let pathMetadata = this.paths.get(path);

    if (pathMetadata === undefined) {
      pathMetadata = new Map<string, PathMetadata>();
      this.paths.set(path, pathMetadata);
    }

    return pathMetadata;
  }

  private getAndRegisterMethod(
    pathMetadata: Map<string, PathMetadata>,
    method: string,
    url: string
  ) {
    let methodMetadata = pathMetadata.get(method);

    if (methodMetadata === undefined) {
      methodMetadata = new PathMetadata(method, url);
      pathMetadata.set(method, methodMetadata);
    }

    return methodMetadata;
  }

  async execute(url: string, method: string, invocation: Invocation) {
    console.log({ url, method, invocation });
    return await axios({
      url: url,
      method: method,
      params: invocation.params,
      headers: invocation.headers,
      data: invocation.body,
    });
  }

  printStatistics() {
    console.log(JSON.stringify(Array.from(this.paths.entries()), null, 2));
  }

  getData() {
    const data: any = {};

    for (const [path, methodMap] of this.paths) {
      data[path] = {};

      for (const [method, methodMetadata] of methodMap) {
        data[path][method] = methodMetadata.getData();
      }
    }

    return data;
  }

  clearData() {
    this.paths = new Map();
  }
}
