import env from "dotenv";
import { AuthController } from "./controllers/auth-controller";
import { SnifferController } from "./controllers/sniffer.controller";
import { SwaggerUiController } from "./lib/swagger/swagger-controller";
import { Server } from "./server/server";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Sniffer, SnifferRepository } from "./model/sniffer/sniffers.model";
import { SnifferManager } from "./services/sniffer-manager/sniffer-manager";

export const setupFilePath =
  process.env.SETUP_FILE_PATH ?? "./sniffers-setup.json";

async function main() {
  env.config({});

  const appDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: false,
    logging: true,
    entities: [Sniffer],
    subscribers: [],
    migrations: [],
  });

  await appDataSource.initialize();

  const snifferRepository = new SnifferRepository(appDataSource);

  const snifferManager = new SnifferManager(snifferRepository);

  const authController = new AuthController();
  const snifferController = new SnifferController(snifferManager);
  const swaggerUi = new SwaggerUiController();

  const snifferManagerServer = new Server(
    [snifferController.getRouter(), authController.getRouter()],
    swaggerUi,
  );
  snifferManagerServer.start();
}

main();
