"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterceptedRequests = void 0;
const intercepted_request_1 = require("../intercepted-request/");
const requests_map_1 = require("./requests-map");
class InterceptedRequests {
    requests;
    constructor() {
        this.requests = new requests_map_1.RequestsMap();
    }
    ensureRequest(key, service) {
        if (this.requests.has(key)) {
            return this.requests.get(key);
        }
        else {
            const request = new intercepted_request_1.InterceptedRequest(key, service);
            this.requests.set(key, request);
            return request;
        }
    }
    interceptRequest(request, service) {
        const { method, path } = request;
        const key = new intercepted_request_1.RequestKey(method, path);
        const interceptedRequest = this.ensureRequest(key, service);
        interceptedRequest.intercept(request);
    }
    execute(url, method, invocation, service) {
        const interceptedRequest = this.ensureRequest(new intercepted_request_1.RequestKey(method, url), service);
        return interceptedRequest.execute(invocation);
    }
    stats() {
        const result = [];
        for (const request of this.requests.values()) {
            result.push(request.stats());
        }
        return result;
    }
    invalidate() {
        this.requests.clear();
    }
}
exports.InterceptedRequests = InterceptedRequests;
