import { Request } from "express";
import { InterceptedRequest, RequestKey } from "./intercepted-request";
import { Invocation, PathResponseData } from "../../types/types";

class Requests implements Map<RequestKey, InterceptedRequest> {
  size: number;

  constructor(private readonly map: Map<string, InterceptedRequest> = new Map()) {
    this.size = map.size;
  }

  clear(): void {
    this.map.clear();
    this.size = this.map.size;
  }

  delete(key: RequestKey): boolean {
    const result = this.map.delete(key.toString());
    this.size = this.map.size;
    return result;
  }

  forEach(callbackfn: (value: InterceptedRequest, key: RequestKey, map: Map<RequestKey, InterceptedRequest>) => void, thisArg?: any): void {
    this.map.forEach((value, key) => {
      callbackfn.apply(thisArg, [value, RequestKey.fromString(key), this]);
    });
  }

  get(key: RequestKey): InterceptedRequest | undefined {
    return this.map.get(key.toString());
  }

  has(key: RequestKey): boolean {
    return this.map.has(key.toString());
  }

  set(key: RequestKey, value: InterceptedRequest): this {
    this.map.set(key.toString(), value);
    this.size = this.map.size;
    return this;
  }
  
  entries(): IterableIterator<[RequestKey, InterceptedRequest]> {
    const me = this;
    return (function* iterator() {
      for (const [key, value] of me.map[Symbol.iterator]()) {
        yield [RequestKey.fromString(key), value];
      }
    })();
  }

  keys(): IterableIterator<RequestKey> {
    const me = this;
    return (function* keys() {
      for (const key of me.map.keys()) {
        yield RequestKey.fromString(key);
      }
    })();
  }

  values(): IterableIterator<InterceptedRequest> {
    return this.map.values();
  }

  [Symbol.iterator](): IterableIterator<[RequestKey, InterceptedRequest]> {
    return this.entries();
  }

  [Symbol.toStringTag]: string = "Requests";
}

export class InterceptedRequests {
  private paths: Map<string, Map<string, InterceptedRequest>>;
  private requests: Requests;

  constructor() {
    this.paths = new Map();
    this.requests = new Requests();
  }

  private ensureRequest(key: RequestKey, service: string) {
    if (this.requests.has(key)) {
      return this.requests.get(key)!;
    } else {
      const request = new InterceptedRequest(key, service);
      this.requests.set(key, request);
      return request;
    }
  }

  interceptRequest(request: Request, service: string) {
    const { method, path } = request;
    const key = new RequestKey(method, path);
    const interceptedRequest = this.ensureRequest(key, service);
    interceptedRequest.intercept(request);
  }

  execute(url: string, method: string, invocation: Invocation, service: string) {
    const interceptedRequest = this.ensureRequest(new RequestKey(method, url), service);
    return interceptedRequest.execute(invocation);
  }

  stats(): PathResponseData[] {
    const result: PathResponseData[] = [];

    for (const request of this.requests.values()) {
      result.push(request.stats());
    }

    return result;
  }

  invalidate() {
    this.requests.clear();
  }
}
