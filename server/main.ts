require("dotenv/config");
import { Server } from "./server/server";
import { SwaggerUiController } from "./lib/swagger/swagger-controller";
import { AuthController } from "./controllers/auth-controller";
import { SnifferManagerController } from "./controllers/sniffer-manager-controller";
import { MockManagerController } from "./controllers/mock-manager-controller";
import { CollectionManagerController } from "./controllers/collection-manager-controller";
import { SnifferManager } from "./services/sniffer-manager/sniffer-manager";
import { CollectionManager } from "./services/collection-manager/collection-manager";
import { SnifferModel } from "./model/sniffer/sniffers.model";

export const setupFilePath =
  process.env.SETUP_FILE_PATH ?? "./sniffers-setup.json";

async function main() {
  const snifferModel = new SnifferModel();
  const snifferManager = new SnifferManager(snifferModel);
  const collectionManager = new CollectionManager();
  const collectionManagerController = new CollectionManagerController(
    collectionManager,
  );
  const authController = new AuthController();
  await snifferManager.loadSniffersFromConfig();

  const snifferController = new SnifferManagerController(snifferManager);
  const mockManagerController = new MockManagerController(snifferManager);
  const swaggerUi = new SwaggerUiController();

  const snifferManagerServer = new Server([
    snifferController,
    mockManagerController,
    collectionManagerController,
    authController,
    swaggerUi,
  ]);

  snifferManagerServer.start();
}

main();
