import env from "dotenv";
import { AuthController } from "./controllers/auth-controller";
import SettingsController from "./controllers/settings";
import { SnifferController } from "./controllers/sniffer.controller";
import { SwaggerUiController } from "./lib/swagger/swagger-controller";
import { Server } from "./server/server";
import "reflect-metadata";
import { SnifferRepository } from "./model/sniffer/sniffers.model";
import { SnifferManager } from "./services/sniffer-manager/sniffer-manager";
import { getAppDataSource } from "./server/AppDataSource";

export const setupFilePath =
  process.env.SETUP_FILE_PATH ?? "./sniffers-setup.json";

async function main() {
  env.config({});
  const appDataSource = await getAppDataSource();

  const snifferRepository = new SnifferRepository(appDataSource);

  const snifferManager = new SnifferManager(snifferRepository);

  const settingsController = new SettingsController();
  const authController = new AuthController();
  const snifferController = new SnifferController(snifferManager);
  const swaggerUi = new SwaggerUiController();

  const snifferManagerServer = new Server(
    [
      authController.getRouter(),
      snifferController.getRouter(),
      settingsController.getRouter(),
    ],
    swaggerUi,
  );
  snifferManagerServer.start();
}

main();
