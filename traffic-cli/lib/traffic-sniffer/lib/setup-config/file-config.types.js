"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sniffersConfigValidator = void 0;
const zod_1 = __importDefault(require("zod"));
const snifferConfigValidator = zod_1.default.object({
    name: zod_1.default.string(),
    port: zod_1.default.number(),
    downstreamUrl: zod_1.default.string(),
    id: zod_1.default.string(),
    isStarted: zod_1.default.boolean(),
});
exports.sniffersConfigValidator = zod_1.default.array(snifferConfigValidator);
