"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sniffer = void 0;
const body_parser_1 = require("body-parser");
const express_1 = __importDefault(require("express"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const intercepted_requests_1 = require("../intercepted-requests/intercepted-requests");
const mock_manager_1 = __importDefault(require("./mock/mock-manager"));
const mock_middleware_1 = __importDefault(require("./mock/mock-middleware"));
const log_1 = require("../log");
const log = (0, log_1.useLog)({
    dirname: __dirname,
    filename: __filename,
});
class Sniffer {
    id;
    app;
    interceptedRequests;
    config;
    server;
    proxyMiddleware;
    isStarted;
    mockManager;
    mockMiddleware;
    constructor(config) {
        this.interceptedRequests = new intercepted_requests_1.InterceptedRequests();
        this.config = config;
        this.app = (0, express_1.default)();
        this.id = config.id;
        this.isStarted = false;
        this.mockManager = new mock_manager_1.default();
        this.mockMiddleware = new mock_middleware_1.default(this.mockManager);
        this.proxyMiddleware = (0, http_proxy_middleware_1.createProxyMiddleware)({
            target: config.downstreamUrl,
            secure: false,
            logLevel: "debug",
            autoRewrite: true,
            changeOrigin: true,
        });
        this.setup();
    }
    requestInterceptor(req, res, next) {
        log.info("Request logged", {
            config: this.config,
            method: req.method,
            url: req.url,
        });
        this.interceptedRequests.interceptRequest(req, this.config.name);
        next();
    }
    getApp() {
        return this.app;
    }
    getPort() {
        return this.config.port;
    }
    setup() {
        this.app.use((0, body_parser_1.json)());
        this.app.use(this.requestInterceptor.bind(this));
        this.app.use(this.mockMiddleware.mock.bind(this));
        this.app.use(this.proxyMiddleware);
    }
    invalidateInterceptedRequests() {
        this.interceptedRequests.invalidate();
    }
    execute(url, method, invocation) {
        const executionUrl = `http://localhost:${this.config.port}${url}`;
        return this.interceptedRequests.execute(executionUrl, method, invocation, this.config.name);
    }
    async changeConfig(newConfig) {
        log.info("Stopping server", {
            config: this.config,
        });
        await this.stop();
        log.info("Changing config", {
            config: this.config,
        });
        this.config = newConfig;
        log.info("Starting server with new config", {
            config: this.config,
        });
        await this.start();
    }
    start() {
        log.info("Starting sniffer", { config: this.config });
        return new Promise((resolve, reject) => {
            this.server = this.app
                .listen(this.config.port, () => {
                log.info("Started sniffing", { config: this.config });
                this.isStarted = true;
                return resolve(undefined);
            })
                .on("error", (error) => {
                log.error("Failed to start sniffer for proxy", {
                    config: this.config,
                    error: error.message,
                });
                return reject(error);
            })
                .on("clientError", (error) => {
                log.error("A clientError has occurred", { error: error.message });
                return reject(error);
            });
        });
    }
    stop() {
        return new Promise((resolve, reject) => {
            log.info("Stopping sniffer", { config: this.config });
            this.server?.close((error) => {
                if (error) {
                    log.error("couldn't stop the sniffer", {
                        config: this.config,
                        error: error.message,
                    });
                    return reject(error);
                }
                this.isStarted = false;
                log.info("Stopped sniffer", { config: this.config });
                return resolve(undefined);
            });
        });
    }
    async editSniffer(newConfig) {
        if (this.isStarted) {
            await this.stop();
        }
        this.config = newConfig;
        this.id = newConfig.port.toString();
        this.config.id = newConfig.port.toString();
    }
    stats() {
        const { config, isStarted, id, interceptedRequests } = this;
        return {
            id,
            config,
            isStarted,
            mocks: this.mockManager.getAllMocks(),
            interceptedRequests: interceptedRequests.stats(),
        };
    }
    getConfig() {
        return this.config;
    }
    getIsStarted() {
        return this.isStarted;
    }
    getMiddleware() {
        return this.proxyMiddleware;
    }
    getId() {
        return this.id;
    }
    getMockManager() {
        return this.mockManager;
    }
}
exports.Sniffer = Sniffer;
