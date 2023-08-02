"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnifferManagerServer = void 0;
const body_parser_1 = require("body-parser");
const express_1 = __importDefault(require("express"));
const log_1 = require("../log");
const log = (0, log_1.useLog)({
    dirname: __dirname,
    filename: __filename,
});
class SnifferManagerServer {
    port = 5012;
    app;
    server;
    constructor(controllers) {
        this.app = (0, express_1.default)();
        this.app.use((0, body_parser_1.json)());
        controllers.forEach((controller) => {
            controller.setup(this.app);
        });
    }
    start() {
        this.server = this.app.listen(this.port, () => {
            log.info("Server started listening on port 5012");
        });
    }
    stop() {
        this.server?.close();
    }
}
exports.SnifferManagerServer = SnifferManagerServer;
