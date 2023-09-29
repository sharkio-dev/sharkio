"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterceptedRequest = void 0;
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
class InterceptedRequest {
    static defaultConfig = {
        bodyHistoryLimit: 10,
        recordBodies: true,
        recordHeaders: true,
        recordCookies: true,
        recordParams: true,
    };
    id;
    service;
    url;
    method;
    hitCount;
    lastInvocationDate;
    invocations;
    config;
    constructor(key, service) {
        this.id = (0, uuid_1.v4)();
        this.service = service;
        this.method = key.method;
        this.url = key.url;
        this.hitCount = 0;
        this.lastInvocationDate = undefined;
        this.invocations = [];
        this.config = InterceptedRequest.defaultConfig;
    }
    logInvocation(request) {
        if (this.invocations.length >= this.config.bodyHistoryLimit) {
            this.invocations.shift();
        }
        this.invocations.push({
            id: (0, uuid_1.v4)(),
            timestamp: new Date(),
            body: this.config.recordBodies === true ? request.body : undefined,
            headers: this.config.recordBodies === true ? request.headers : undefined,
            cookies: this.config.recordBodies === true ? request.cookies : undefined,
            params: this.config.recordParams === true ? request.params : undefined,
        });
    }
    intercept(request) {
        this.hitCount++;
        this.lastInvocationDate = new Date();
        this.logInvocation(request);
    }
    async execute(invocation) {
        return await (0, axios_1.default)({
            url: this.url,
            method: this.method,
            params: invocation.params,
            headers: invocation.headers,
            data: invocation.body,
        });
    }
    stats() {
        const { id, url, service, method, hitCount, lastInvocationDate, invocations, } = this;
        return {
            id,
            service,
            url,
            method,
            hitCount,
            lastInvocationDate,
            invocations,
        };
    }
}
exports.InterceptedRequest = InterceptedRequest;
