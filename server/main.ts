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
import { RequestInterceptor } from "./server/middlewares/request-interceptor";
import { ProxyServer } from "./server/proxy-server";
import { Server } from "./server/server";
import RequestService from "./services/request/request.service";
import { SnifferService } from "./services/sniffer/sniffer.service";
import { RequestController } from "./controllers/request.controller";
import { InvocationRepository } from "./model/invocation/invocation.model";
import ResponseService from "./services/response/response.service";
import { ResponseRepository } from "./model/response/response.model";

export const setupFilePath =
  process.env.SETUP_FILE_PATH ?? "./sniffers-setup.json";

async function main() {
  const appDataSource = await getAppDataSource();

  /* Repositories */
  const requestRepository = new RequestRepository(appDataSource);
  const responseRepository = new ResponseRepository(appDataSource);
  const invocationRepository = new InvocationRepository(appDataSource);
  const snifferRepository = new SnifferRepository(appDataSource);
  const apiKeyRepository = new ApiKeyRepository(appDataSource);
  const userRepository = new UserRepository(appDataSource);

  /* Services */
  const snifferService = new SnifferService(snifferRepository);
  const responseService = new ResponseService(responseRepository);
  const requestService = new RequestService(
    requestRepository,
    invocationRepository,
  );
  const userService = new UserService(userRepository);
  const apiKeyService = new APIKeysService(apiKeyRepository, userRepository);

  /* Controllers */
  const settingsController = new SettingsController(apiKeyService);
  const authController = new AuthController(userService);
  const cliController = new CLIController(
    apiKeyService,
    userService,
    snifferService,
  );
  const snifferController = new SnifferController(
    snifferService,
    requestService,
  );
  const requestController = new RequestController(
    requestService,
    snifferService,
  );
  const swaggerUi = new SwaggerUiController();

  /* Middlewares */
  const requestInterceptorMiddleware = new RequestInterceptor(
    snifferService,
    requestService,
    responseService,
  );
  const proxyMiddleware = new ProxyMiddleware(
    snifferService,
    requestInterceptorMiddleware,
  );

  /* Servers */
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
      requestController.getRouter(),
    ],
    swaggerUi,
  );

  /* Start Servers */
  snifferManagerServer.start();
  proxyServer.start();
}

main();
