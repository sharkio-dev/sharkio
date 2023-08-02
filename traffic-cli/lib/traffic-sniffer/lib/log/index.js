"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLog = void 0;
const winston_1 = require("winston");
const log = (0, winston_1.createLogger)({
    transports: [new winston_1.transports.Console()],
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
});
const useLog = (properties) => {
    return log.child(properties);
};
exports.useLog = useLog;
