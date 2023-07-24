import { InterceptedRequest, RequestKey } from "../intercepted-request";

export class RequestsMap implements Map<RequestKey, InterceptedRequest> {
  size: number;

  constructor(
    private readonly map: Map<string, InterceptedRequest> = new Map()
  ) {
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

  forEach(
    callbackfn: (
      value: InterceptedRequest,
      key: RequestKey,
      map: Map<RequestKey, InterceptedRequest>
    ) => void,
    thisArg?: any
  ): void {
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

  [Symbol.toStringTag]: string = RequestsMap.name;
}
