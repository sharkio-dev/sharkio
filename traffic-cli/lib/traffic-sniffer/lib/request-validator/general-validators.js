"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.portValidator = void 0;
const zod_1 = require("zod");
exports.portValidator = zod_1.z.coerce
    .number()
    .nonnegative("Port number cannot be negative");
