"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileAlreadyExist = exports.checkIfDirExistElseMakeDir = exports.checkExistence = void 0;
const fs_1 = __importDefault(require("fs"));
const logger_util_1 = require("./logger.util");
const checkExistence = (path) => {
    return fs_1.default.existsSync(process.cwd() + path);
};
exports.checkExistence = checkExistence;
const checkIfDirExistElseMakeDir = (path) => {
    if (path) {
        const dir = (0, exports.checkExistence)(path);
        if (!dir) {
            fs_1.default.mkdirSync(process.cwd() + path, { recursive: true });
        }
    }
};
exports.checkIfDirExistElseMakeDir = checkIfDirExistElseMakeDir;
const fileAlreadyExist = (fileName) => {
    (0, logger_util_1.showError)(`${fileName} already exists!`);
    process.exit(1);
};
exports.fileAlreadyExist = fileAlreadyExist;
