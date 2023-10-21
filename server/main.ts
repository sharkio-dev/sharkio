import env from "dotenv";
// import { AuthController } from "./controllers/auth-controller";
// import { CollectionManagerController } from "./controllers/collection-manager-controller";
// import { MockManagerController } from "./controllers/mock-manager-controller";
// import { SnifferManagerController } from "./controllers/sniffer-manager-controller";
// import { SwaggerUiController } from "./lib/swagger/swagger-controller";
// import { SnifferModel } from "./model/sniffer/sniffers.model";
// import { Server } from "./server/server";
// import { CollectionManager } from "./services/collection-manager/collection-manager";
// import { SnifferManager } from "./services/sniffer-manager/sniffer-manager";
import { Sniffer } from "./model/sniffer/sniffers.model";
import { DataSource } from "typeorm";
import "reflect-metadata";

export const setupFilePath =
  process.env.SETUP_FILE_PATH ?? "./sniffers-setup.json";

async function main() {
  env.config({});

  const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: false,
    logging: true,
    entities: [Sniffer],
    subscribers: [],
    migrations: [],
  });
  await AppDataSource.initialize();

  const sniffers = await AppDataSource.manager.getRepository(Sniffer).find();
  sniffers.forEach((sniffer) => {
    console.log({ sniffer });
  });

  // const snifferModel = new SnifferModel();
  // const snifferManager = new SnifferManager(snifferModel);
  // const collectionManager = new CollectionManager();
  // const collectionManagerController = new CollectionManagerController(
  //   collectionManager
  // );
  // const authController = new AuthController();
  // const snifferController = new SnifferManagerController(snifferManager);
  // const mockManagerController = new MockManagerController(snifferManager);
  // const swaggerUi = new SwaggerUiController();
  // const snifferManagerServer = new Server(
  //   [
  //     snifferController,
  //     mockManagerController,
  //     collectionManagerController,
  //     authController,
  //   ],
  //   swaggerUi
  // );
  // snifferManagerServer.start();
}

main();
