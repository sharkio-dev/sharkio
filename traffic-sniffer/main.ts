require("dotenv/config");
import { FileConfig } from "./lib/setup-config/file-config";
import { SnifferConfigSetup } from "./lib/setup-config/file-config.types";
import { MockManagerController } from "./lib/sniffer-manager/mock-manager-controller";
import { SnifferManager } from "./lib/sniffer-manager/sniffer-manager";
import { SnifferManagerController } from "./lib/sniffer-manager/sniffer-manager-controller";
import { SnifferManagerServer } from "./lib/sniffer-manager/sniffer-manager-server";
import { SwaggerUiController } from "./lib/swagger/swagger-controller";
export const setupFilePath =
  process.env.SETUP_FILE_PATH ?? "./sniffers-setup.json";

async function main() {
  const fileConfig = new FileConfig(setupFilePath);
  const config = fileConfig.getConfig();
  console.debug(config);

  const snifferManager = new SnifferManager(fileConfig);

  const configData: SnifferConfigSetup[] = fileConfig.getConfig();
  await snifferManager.loadSniffersFromConfig(configData);

  const snifferController = new SnifferManagerController(snifferManager);
  const mockManagerController = new MockManagerController(snifferManager);
  const swaggerUi = new SwaggerUiController();
  const snifferManagerServer = new SnifferManagerServer([
    snifferController,
    mockManagerController,
    swaggerUi,
  ]);

  snifferManagerServer.start();
}

main();
