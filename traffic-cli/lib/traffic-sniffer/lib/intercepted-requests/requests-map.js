"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestsMap = void 0;
const intercepted_request_1 = require("../intercepted-request");
class RequestsMap {
    map;
    size;
    constructor(map = new Map()) {
        this.map = map;
        this.size = map.size;
    }
    clear() {
        this.map.clear();
        this.size = this.map.size;
    }
    delete(key) {
        const result = this.map.delete(key.toString());
        this.size = this.map.size;
        return result;
    }
    forEach(callbackfn, thisArg) {
        this.map.forEach((value, key) => {
            callbackfn.apply(thisArg, [value, intercepted_request_1.RequestKey.fromString(key), this]);
        });
    }
    get(key) {
        return this.map.get(key.toString());
    }
    has(key) {
        return this.map.has(key.toString());
    }
    set(key, value) {
        this.map.set(key.toString(), value);
        this.size = this.map.size;
        return this;
    }
    entries() {
        const me = this;
        return (function* iterator() {
            for (const [key, value] of me.map[Symbol.iterator]()) {
                yield [intercepted_request_1.RequestKey.fromString(key), value];
            }
        })();
    }
    keys() {
        const me = this;
        return (function* keys() {
            for (const key of me.map.keys()) {
                yield intercepted_request_1.RequestKey.fromString(key);
            }
        })();
    }
    values() {
        return this.map.values();
    }
    [Symbol.iterator]() {
        return this.entries();
    }
    [Symbol.toStringTag] = RequestsMap.name;
}
exports.RequestsMap = RequestsMap;
