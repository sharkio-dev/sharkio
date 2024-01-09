import "dotenv/config";
import "reflect-metadata";
import { AuthController } from "./controllers/auth.controller";
import { ChatController } from "./controllers/chat.controller";
import CLIController from "./controllers/cli-controller";
import { EndpointController } from "./controllers/endpoint.controller";
import { InvocationController } from "./controllers/invocation.controller";
import SettingsController from "./controllers/settings";
import { SnifferController } from "./controllers/sniffer.controller";
import { MockController } from "./controllers/mock.controller";
import { MockResponseController } from "./controllers/mock-response.controller";
import { TestSuiteController } from "./controllers/test-suite.controller";
import { SwaggerUiController } from "./lib/swagger/swagger-controller";
import { createConnection } from "./model/ormconfig";
import { ProxyMiddleware } from "./server/middlewares/proxy.middleware";
import { RequestInterceptor } from "./server/middlewares/interceptor.middleware";
import { CloudInterceptor } from "./server/interceptors/CloudInterceptor";
import { ProxyServer } from "./server/proxy-server";
import { Server } from "./server/server";
import { ChatService } from "./services/chat/chat.service";
import EndpointService from "./services/endpoint/endpoint.service";
import { RequestService } from "./services/request/request.service";
import ResponseService from "./services/response/response.service";
import { MockService } from "./services/mock/mock.service";
import { MockResponseService } from "./services/mock-response/mock-response.service";
import APIKeysService from "./services/settings/apiKeys";
import { SnifferDocGenerator } from "./services/sniffer-doc-generator/sniffer-doc-generator.service";
import { SnifferService } from "./services/sniffer/sniffer.service";
import { TestService } from "./services/testSuite/test.service";
import { TestExecutionService } from "./services/testSuite/testExecution.service";
import { TestSuiteService } from "./services/testSuite/testSuite.service";
import UserService from "./services/user/user";
import { ServerEnvValidator, ProxyEnvValidator } from "./env.validator";
import { useLog } from "./lib/log";
import MockMiddleware from "./server/middlewares/mock.middleware";
import { ImportService } from "./services/imports/imports.service";
import { WorkspaceService } from "./services/workspace/workspace.service";
import { WorkspaceController } from "./controllers/workSpace.controller";
import UserRepository from "./model/repositories/user.repository";
import { EndpointRepository } from "./model/repositories/endpoint.repository";
import { ResponseRepository } from "./model/repositories/response.repository";
import { RequestRepository } from "./model/repositories/request.repository";
import { SnifferRepository } from "./model/repositories/sniffers.repository";
import ApiKeyRepository from "./model/repositories/apiKeys.repository";
import ChatRepository from "./model/repositories/chat/chat.repository";
import MessageRepository from "./model/repositories/chat/message.repository";
import { TestSuiteRepository } from "./model/repositories/testSuite/testSuite.repository";
import { TestRepository } from "./model/repositories/testSuite/test.repository";
import { TextExecutionRepository } from "./model/repositories/testSuite/testExecution.repository";
import { MockRepository } from "./model/repositories/mock.repository";
import { MockResponseRepository } from "./model/repositories/mock-response.repository";
import { WorkspaceRepository } from "./model/repositories/workSpace.repository";
import { MockResponseSelector } from "./services/mock-response-selector/mock-response-selector";
import {
  DefaultResponseSelector,
  RandomResponseSelector,
  SequentialResponseSelector,
} from "./services/mock-response-selector";
import { MockResponseTransformer } from "./services/mock-response-transformer/mock-response-transformer";
import { Interceptor } from "./server/interceptors/Interceptor";

const logger = useLog({ dirname: __dirname, filename: __filename });

const validateServerEnv = () => {
  const envsValidator = new ServerEnvValidator();
  try {
    envsValidator.validate();
  } catch (e) {
    logger.error("Missing server environment variables");
    logger.error(e);
  }
};

const validateProxyEnv = () => {
  const envsValidator = new ProxyEnvValidator();
  try {
    envsValidator.validate();
  } catch (e) {
    logger.error("Missing proxy environment variables");
    logger.error(e);
  }
};

async function main(isProxy = true, isServer = true) {
  if (isProxy) validateProxyEnv();
  if (isServer) validateServerEnv();

  const appDataSource = await createConnection().initialize();

  /* Repositories */
  const mockResponseRepository = new MockResponseRepository(appDataSource);
  const mockRepository = new MockRepository(appDataSource);
  const endpointRepository = new EndpointRepository(appDataSource);
  const responseRepository = new ResponseRepository(appDataSource);
  const invocationRepository = new RequestRepository(appDataSource);
  const snifferRepository = new SnifferRepository(appDataSource);
  const apiKeyRepository = new ApiKeyRepository(appDataSource);
  const userRepository = new UserRepository(appDataSource);
  const chatRepository = new ChatRepository(appDataSource);
  const messageRepository = new MessageRepository(appDataSource);
  const testSuiteRepository = new TestSuiteRepository(appDataSource);
  const testRepository = new TestRepository(appDataSource);
  const testExecutionRepository = new TextExecutionRepository(appDataSource);
  const workspaceRepository = new WorkspaceRepository(appDataSource);

  /* Services */
  const mockService = new MockService(mockRepository, mockResponseRepository);
  const snifferService = new SnifferService(snifferRepository);
  const responseService = new ResponseService(responseRepository);
  const endpointService = new EndpointService(
    endpointRepository,
    invocationRepository,
  );
  const mockResponseService = new MockResponseService(mockResponseRepository);
  const userService = new UserService(userRepository);
  const apiKeyService = new APIKeysService(apiKeyRepository, userRepository);
  const docGenerator = new SnifferDocGenerator(snifferService, endpointService);
  const chatService = new ChatService(chatRepository, messageRepository);
  const testSuiteService = new TestSuiteService(testSuiteRepository);
  const testService = new TestService(testRepository);
  const requestService = new RequestService(invocationRepository);
  const testExecutionService = new TestExecutionService(
    testExecutionRepository,
  );
  const importService = new ImportService(endpointService);
  const workspaceService = new WorkspaceService(workspaceRepository);
  const mockSelectionStrategies = {
    default: new DefaultResponseSelector(),
    random: new RandomResponseSelector(),
    sequence: new SequentialResponseSelector(),
  };
  const mockResponseSelectorService = new MockResponseSelector(
    mockSelectionStrategies,
  );
  const mockResponseTransformer = new MockResponseTransformer();

  /* Controllers */
  const mockResponseController = new MockResponseController(
    mockResponseService,
  );
  const mockController = new MockController(mockService, endpointService);
  const settingsController = new SettingsController(apiKeyService);
  const authController = new AuthController(userService);
  const cliController = new CLIController(
    apiKeyService,
    userService,
    snifferService,
  );
  const snifferController = new SnifferController(
    snifferService,
    docGenerator,
    endpointService,
    mockService,
  );
  const endpointController = new EndpointController(
    endpointService,
    snifferService,
    requestService,
    importService,
  );
  const invocationController = new InvocationController(endpointService);
  const chatController = new ChatController(
    snifferService,
    endpointService,
    chatService,
  );
  const swaggerUi = new SwaggerUiController();
  const testSuiteController = new TestSuiteController(
    testSuiteService,
    endpointService,
    testService,
    requestService,
    snifferService,
    testExecutionService,
  );
  const workspaceController = new WorkspaceController(workspaceService);

  /* Interceptors */
  const cloudInterceptor = new CloudInterceptor(
    snifferService,
    endpointService,
    responseService,
    mockService,
  );
  const interceptors: Record<string, Interceptor> = {
    cloud: cloudInterceptor,
  };
  const selectedInterceptor =
    interceptors[process.env.INTERCEPTOR_STRATEGY ?? "cloud"];

  /* Middlewares */
  const requestInterceptorMiddleware = new RequestInterceptor(
    selectedInterceptor,
  );
  const proxyMiddleware = new ProxyMiddleware(
    snifferService,
    requestInterceptorMiddleware,
  );
  const mockMiddleware = new MockMiddleware(
    selectedInterceptor,
    mockResponseSelectorService,
    mockResponseTransformer,
  );

  /* Servers */
  const proxyServer = new ProxyServer(
    proxyMiddleware,
    requestInterceptorMiddleware,
    mockMiddleware,
  );

  const snifferManagerServer = new Server(
    [
      authController.getRouter(),
      mockResponseController.getRouter(),
      snifferController.getRouter(),
      settingsController.getRouter(),
      invocationController.getRouter(),
      cliController.getRouter(),
      endpointController.getRouter(),
      chatController.getRouter(),
      testSuiteController.getRouter(),
      mockController.getRouter(),
      workspaceController.getRouter(),
    ],
    swaggerUi,
  );

  // /* Start Servers */
  if (isProxy) proxyServer.start();
  if (isServer) snifferManagerServer.start();
}
const IS_PROXY = process.env.IS_PROXY === "true";
const IS_SERVER = process.env.IS_SERVER === "true";

if (process.env.NODE_ENV === "production") {
  main(IS_PROXY, IS_SERVER);
} else {
  main();
}
