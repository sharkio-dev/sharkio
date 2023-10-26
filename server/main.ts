import "dotenv/config";
import "reflect-metadata";
import { AuthController } from "./controllers/auth.controller";
import SettingsController from "./controllers/settings";
import { SnifferController } from "./controllers/sniffer.controller";
import { SwaggerUiController } from "./lib/swagger/swagger-controller";
import ApiKeyRepository from "./model/apikeys/apiKeys.model";
import APIKeysService from "./services/settings/apiKeys";
import CLIController from "./controllers/cli-controller";
import UserRepository from "./model/user/user.model";
import UserService from "./services/user/user";
import { RequestRepository } from "./model/request/request.model";
import { SnifferRepository } from "./model/sniffer/sniffers.model";
import { getAppDataSource } from "./server/app-data-source";
import { ProxyMiddleware } from "./server/middlewares/proxy.middleware";
import { RequestInterceptorMiddleware } from "./server/middlewares/request-interceptor.middleware";
import { ProxyServer } from "./server/proxy-server";
import { Server } from "./server/server";
import RequestService from "./services/request/request.service";
import { SnifferService } from "./services/sniffer/sniffer.service";

export const setupFilePath =
  process.env.SETUP_FILE_PATH ?? "./sniffers-setup.json";

async function main() {
  const appDataSource = await getAppDataSource();

  const snifferRepository = new SnifferRepository(appDataSource);
  const apiKeyRepository = new ApiKeyRepository(appDataSource);
  const userRepository = new UserRepository(appDataSource);
  const userService = new UserService(userRepository);
  const apiKeyService = new APIKeysService(apiKeyRepository, userRepository);

  const settingsController = new SettingsController(apiKeyService);
  const authController = new AuthController(userService);
  const cliController = new CLIController(apiKeyService, userService);
  const requestRepository = new RequestRepository(appDataSource);

  const snifferService = new SnifferService(snifferRepository);
  const requestService = new RequestService(requestRepository);

  const snifferController = new SnifferController(snifferService);
  const swaggerUi = new SwaggerUiController();
  const proxyMiddleware = new ProxyMiddleware(snifferService);

  const requestInterceptorMiddleware = new RequestInterceptorMiddleware(
    snifferService,
    requestService,
  );

  const proxyServer = new ProxyServer(
    proxyMiddleware,
    requestInterceptorMiddleware,
  );

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
  proxyServer.start();
}

main();
