require("dotenv/config");
import { MockManagerController } from "./lib/sniffer-manager/mock-manager-controller";
import { SnifferManager } from "./lib/sniffer-manager/sniffer-manager";
import { SnifferManagerController } from "./lib/sniffer-manager/sniffer-manager-controller";
import { SnifferManagerServer } from "./lib/sniffer-manager/sniffer-manager-server";
import { SwaggerUiController } from "./lib/swagger/swagger-controller";
import { CollectionManager } from "./lib/collection-manager/collection-manager";
import { CollectionManagerController } from "./lib/collection-manager/collection-manager-controller";
import { CollectionFilePersistency } from "./lib/collection-manager/collection-file-persistency";
import { FileConfig } from "./lib/model/setup-config/file-config";
import { DbConfig } from "./lib/model/setup-config/db-config";
import { SnifferConfigSetup } from "./lib/model/setup-config/file-config.types";
export const setupFilePath =
  process.env.SETUP_FILE_PATH ?? "./sniffers-setup.json";

async function main() {
  const fileConfig = new FileConfig(setupFilePath);
  const config = fileConfig.getAllUsersConfig();
  console.debug(config);

  const collectionFilePersistency = new CollectionFilePersistency(
    "./collections.json",
  );
  const dbConfig = new DbConfig();
  const snifferManager = new SnifferManager(dbConfig);
  const collectionManager = new CollectionManager(collectionFilePersistency);
  const collectionManagerController = new CollectionManagerController(
    collectionManager,
  );

  await snifferManager.loadSniffersFromConfig();

  const snifferController = new SnifferManagerController(snifferManager);
  const mockManagerController = new MockManagerController(snifferManager);
  const swaggerUi = new SwaggerUiController();
  const snifferManagerServer = new SnifferManagerServer([
    snifferController,
    mockManagerController,
    collectionManagerController,
    swaggerUi,
  ]);

  snifferManagerServer.start();
}

main();
