"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestKey = void 0;
class RequestKey extends Object {
    method;
    url;
    constructor(method, url) {
        super();
        this.method = method;
        this.url = url;
    }
    static fromString(string) {
        const [method, path] = string.split(" ");
        return new this(method, path);
    }
    toString() {
        return `${this.method} ${this.url}`;
    }
}
exports.RequestKey = RequestKey;
