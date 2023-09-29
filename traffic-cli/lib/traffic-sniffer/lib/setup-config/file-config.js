"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileConfig = void 0;
const fs_1 = __importDefault(require("fs"));
const promises_1 = __importDefault(require("fs/promises"));
const zod_1 = require("zod");
const file_config_types_1 = require("./file-config.types");
const log_1 = require("../log");
const log = (0, log_1.useLog)({
    dirname: __dirname,
    filename: __filename,
});
class FileConfig {
    configData;
    path;
    constructor(path) {
        this.configData = [];
        this.path = path;
    }
    getConfig() {
        this.createFileIfNotExist(this.path);
        this.configData = this.readSetupFileData(this.path);
        console.info("Loaded config from file");
        return this.configData;
    }
    update(existingId, newConfig, isStarted) {
        const foundIndex = this.configData.findIndex((item) => item.id === existingId);
        if (foundIndex === -1) {
            throw new Error("item was not found");
        }
        this.configData[foundIndex] = this.createSnifferSetup(newConfig, isStarted);
        this.writeToSetupFile();
    }
    async createFileIfNotExist(path) {
        if (!fs_1.default.existsSync(path)) {
            fs_1.default.writeFileSync(path, JSON.stringify([]), { flag: "w" });
        }
    }
    readSetupFileData(path) {
        try {
            const fileData = fs_1.default.readFileSync(path, "utf8");
            const parsedData = JSON.parse(fileData);
            file_config_types_1.sniffersConfigValidator.parse(parsedData);
            return parsedData;
        }
        catch (e) {
            if (e instanceof zod_1.ZodError) {
                console.warn("Config file is not valid");
                console.debug(e);
            }
            else {
                console.warn("failed to load config file");
            }
            this.path = this.path.split(".json")[0] + "-temp" + ".json";
            log.error(`Using a temporary config file`, {
                path,
            });
            return [];
        }
    }
    addSniffer(snifferConfig) {
        const addedObj = this.createSnifferSetup(snifferConfig, false);
        const isListed = this.configData.findIndex((item) => item.id === snifferConfig.id);
        if (isListed !== -1) {
            log.info("Sniffer already listed");
            return;
        }
        this.configData.push(addedObj);
        this.writeToSetupFile();
    }
    removeSniffer(port) {
        const foundIndex = this.configData.findIndex((item) => item.port === port);
        if (foundIndex === -1) {
            throw new Error("item was not found");
        }
        this.configData.splice(foundIndex, 1);
        this.writeToSetupFile();
    }
    setIsStarted(snifferId, isStarted) {
        const foundIndex = this.configData.findIndex((item) => item.id === snifferId);
        if (foundIndex === -1) {
            throw new Error("item was not found");
        }
        const updatedSetup = this.configData[foundIndex];
        updatedSetup.isStarted = isStarted;
        this.configData[foundIndex] = updatedSetup;
        this.writeToSetupFile();
    }
    async writeToSetupFile() {
        await promises_1.default.writeFile(this.path, JSON.stringify(this.configData, null, 2));
    }
    createSnifferSetup(snifferConfig, isStarted) {
        return {
            id: snifferConfig.id,
            name: snifferConfig.name,
            downstreamUrl: snifferConfig.downstreamUrl,
            port: snifferConfig.port,
            isStarted: isStarted,
        };
    }
}
exports.FileConfig = FileConfig;
