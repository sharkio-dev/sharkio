require("dotenv/config");
import { FileConfig } from "./lib/setup-config/file-config";
import { SnifferConfigSetup } from "./lib/setup-config/file-config.types";
import { MockManagerController } from "./lib/sniffer-manager/mock-manager-controller";
import { SnifferManager } from "./lib/sniffer-manager/sniffer-manager";
import { SnifferManagerController } from "./lib/sniffer-manager/sniffer-manager-controller";
import { SnifferManagerServer } from "./lib/sniffer-manager/sniffer-manager-server";
import { SwaggerUiController } from "./lib/swagger/swagger-controller";

async function main() {
  const configPersistency = new FileConfig();
  const snifferManager = new SnifferManager(configPersistency);

  const configData: SnifferConfigSetup[] = configPersistency.getSetup();
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
