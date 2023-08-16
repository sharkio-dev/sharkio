require("dotenv/config");
import { FileConfig } from  "../traffic-sniffer/lib/setup-config/file-config";
import { SnifferConfigSetup } from  "../traffic-sniffer/lib/setup-config/file-config.types";
import { MockManagerController } from  "../traffic-sniffer/lib/sniffer-manager/mock-manager-controller";
import { SnifferManager } from  "../traffic-sniffer/lib/sniffer-manager/sniffer-manager";
//import { SnifferManagerController } from "../traffic-sniffer/lib/sniffer-manager/sniffer-manager-controller";
import {CliSnifferManagerController} from "./src/models/cli-sniffer-controller";
import { SnifferManagerServer } from "../traffic-sniffer/lib/sniffer-manager/sniffer-manager-server";
import { SwaggerUiController } from  "../traffic-sniffer/lib/swagger/swagger-controller";
export const setupFilePath =
  process.env.SETUP_FILE_PATH ??  "../traffic-sniffer/sniffers-setup.json";

async function main() {
  const fileConfig = new FileConfig(setupFilePath);
  const config = fileConfig.getConfig();
  console.debug(config);

  const snifferManager = new SnifferManager(fileConfig);

  const configData: SnifferConfigSetup[] = fileConfig.getConfig();
  await snifferManager.loadSniffersFromConfig(configData);

  const snifferController = new CliSnifferManagerController(snifferManager);
  const mockManagerController = new MockManagerController(snifferManager);
  //const swaggerUi = new SwaggerUiController();
  const snifferManagerServer = new SnifferManagerServer([
    snifferController,
    mockManagerController,
 //   swaggerUi,
  ]);

  snifferManagerServer.start();
}

main();