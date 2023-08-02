"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupFilePath = void 0;
require("dotenv/config");
const file_config_1 = require("../traffic-sniffer/lib/setup-config/file-config");
const mock_manager_controller_1 = require("../traffic-sniffer/lib/sniffer-manager/mock-manager-controller");
const sniffer_manager_1 = require("../traffic-sniffer/lib/sniffer-manager/sniffer-manager");
const sniffer_manager_controller_1 = require("../traffic-sniffer/lib/sniffer-manager/sniffer-manager-controller");
//import {CliSnifferManagerController} from "./src/models/cli-sniffer-controller";
const sniffer_manager_server_1 = require("../traffic-sniffer/lib/sniffer-manager/sniffer-manager-server");
exports.setupFilePath = process.env.SETUP_FILE_PATH ?? "../traffic-sniffer/sniffers-setup.json";
async function main() {
    const fileConfig = new file_config_1.FileConfig(exports.setupFilePath);
    const config = fileConfig.getConfig();
    console.debug(config);
    const snifferManager = new sniffer_manager_1.SnifferManager(fileConfig);
    const configData = fileConfig.getConfig();
    await snifferManager.loadSniffersFromConfig(configData);
    const snifferController = new sniffer_manager_controller_1.SnifferManagerController(snifferManager);
    const mockManagerController = new mock_manager_controller_1.MockManagerController(snifferManager);
    //const swaggerUi = new SwaggerUiController();
    const snifferManagerServer = new sniffer_manager_server_1.SnifferManagerServer([
        snifferController,
        mockManagerController,
        //   swaggerUi,
    ]);
    snifferManagerServer.start();
}
main();
