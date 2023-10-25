import "dotenv/config";
import { AuthController } from "./controllers/auth-controller";
import SettingsController from "./controllers/settings";
import { SnifferController } from "./controllers/sniffer.controller";
import { SwaggerUiController } from "./lib/swagger/swagger-controller";
import { Server } from "./server/server";
import "reflect-metadata";
import { SnifferRepository } from "./model/sniffer/sniffers.model";
import { SnifferManager } from "./services/sniffer-manager/sniffer-manager";
import { getAppDataSource } from "./server/AppDataSource";
import ApiKeyRepository from "./model/apikeys/apiKeys.model";
import APIKeysService from "./services/settings/apiKeys";
import CLIController from "./controllers/cli-controller";
import UserRepository from "./model/user/user.model";
import UserService from "./services/user/user";

export const setupFilePath =
  process.env.SETUP_FILE_PATH ?? "./sniffers-setup.json";

async function main() {
  const appDataSource = await getAppDataSource();

  const snifferRepository = new SnifferRepository(appDataSource);

  const snifferManager = new SnifferManager(snifferRepository);
  const apiKeyRepository = new ApiKeyRepository(appDataSource);
  const userRepository = new UserRepository(appDataSource);
  const userService = new UserService(userRepository);
  const apiKeyService = new APIKeysService(apiKeyRepository, userRepository);

  const settingsController = new SettingsController(apiKeyService);
  const authController = new AuthController(userService);
  const snifferController = new SnifferController(snifferManager);
  const cliController = new CLIController(apiKeyService, userService);
  const swaggerUi = new SwaggerUiController();

  const snifferManagerServer = new Server(
    [
      authController.getRouter(),
      snifferController.getRouter(),
      settingsController.getRouter(),
      cliController.getRouter(),
    ],
    swaggerUi,
  );
  snifferManagerServer.start();
}

main();
