import "dotenv/config";
import "reflect-metadata";
import { AuthController } from "./controllers/auth.controller";
import SettingsController from "./controllers/settings";
import { SnifferController } from "./controllers/sniffer.controller";
import { SwaggerUiController } from "./lib/swagger/swagger-controller";
import ApiKeyRepository from "./model/apikeys/apiKeys.model";
import { RequestRepository } from "./model/request/request.model";
import { SnifferRepository } from "./model/sniffer/sniffers.model";
import { getAppDataSource } from "./server/app-data-source";
import { ProxyMiddleware } from "./server/middlewares/proxy.middleware";
import { RequestInterceptorMiddleware } from "./server/middlewares/request-interceptor.middleware";
import { ProxyServer } from "./server/proxy-server";
import { Server } from "./server/server";
import RequestService from "./services/request/request.service";
import APIKeysService from "./services/settings/api-keys";
import { SnifferService } from "./services/sniffer/sniffer.service";
import { RequestController } from "./controllers/request.controller";

export const setupFilePath =
  process.env.SETUP_FILE_PATH ?? "./sniffers-setup.json";

async function main() {
  const appDataSource = await getAppDataSource();
  const snifferRepository = new SnifferRepository(appDataSource);
  const apiKeyRepository = new ApiKeyRepository(appDataSource);
  const requestRepository = new RequestRepository(appDataSource);

  const snifferService = new SnifferService(snifferRepository);
  const apiKeyService = new APIKeysService(apiKeyRepository);
  const requestService = new RequestService(requestRepository);

  const settingsController = new SettingsController(apiKeyService);
  const authController = new AuthController();
  const snifferController = new SnifferController(snifferService);
  const requestController = new RequestController(requestService);
  const swaggerUi = new SwaggerUiController();

  const requestInterceptorMiddleware = new RequestInterceptorMiddleware(
    snifferService,
    requestService,
  );
  const proxyMiddleware = new ProxyMiddleware(snifferService);

  const proxyServer = new ProxyServer(
    proxyMiddleware,
    requestInterceptorMiddleware,
  );

  const snifferManagerServer = new Server(
    [
      authController.getRouter(),
      snifferController.getRouter(),
      settingsController.getRouter(),
      requestController.getRouter(),
    ],
    swaggerUi,
  );
  snifferManagerServer.start();
  proxyServer.start();
  //lg demo
}

main();
