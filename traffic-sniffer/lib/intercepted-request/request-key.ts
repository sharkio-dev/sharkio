export class RequestKey extends Object {
  constructor(public readonly method: string, public readonly url: string) {
    super();
  }

  static fromString(string: string) {
    const [method, path] = string.split(" ");
    return new this(method, path);
  }

  toString(): string {
    return `${this.method} ${this.url}`;
  }
}
