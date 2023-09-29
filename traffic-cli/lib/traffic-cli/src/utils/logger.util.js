"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showUpdate = exports.showCreate = exports.showGenerate = exports.showInfo = exports.showSuccess = exports.showError = exports.showTitleAndBanner = void 0;
//import { red, green, cyan } from 'kleur';
const figlet = __importStar(require("figlet"));
const console_message_1 = require("../models/console-message");
const { cyan, red, green } = require('kleur');
const newLine = '\n';
const showTitleAndBanner = () => {
    console.log(green(figlet.textSync(console_message_1.ConsoleMessage.TITLE, { horizontalLayout: 'full' })));
    console.info(cyan(console_message_1.ConsoleMessage.BANNER));
};
exports.showTitleAndBanner = showTitleAndBanner;
const showError = (message) => {
    console.error(red(console_message_1.ConsoleMessage.ERROR) + message);
};
exports.showError = showError;
const showSuccess = (message) => {
    console.log(green(console_message_1.ConsoleMessage.SUCCESS) + message + newLine);
};
exports.showSuccess = showSuccess;
const showInfo = (message) => {
    console.info(cyan(console_message_1.ConsoleMessage.INFO) + message + newLine);
};
exports.showInfo = showInfo;
const showGenerate = (fileName) => {
    console.log(cyan(console_message_1.ConsoleMessage.GENERATE) + `${fileName}...`);
};
exports.showGenerate = showGenerate;
const showCreate = (fileName, filePath) => {
    filePath
        ? console.log(green(console_message_1.ConsoleMessage.CREATE) + `${fileName} in ${filePath}`)
        : console.log(green(console_message_1.ConsoleMessage.CREATE) + `${fileName}`);
};
exports.showCreate = showCreate;
const showUpdate = (fileName, filePath) => {
    filePath
        ? console.log(green(console_message_1.ConsoleMessage.UPDATE) + `${fileName} in ${filePath}`)
        : console.log(green(console_message_1.ConsoleMessage.UPDATE) + `${fileName}`);
};
exports.showUpdate = showUpdate;
