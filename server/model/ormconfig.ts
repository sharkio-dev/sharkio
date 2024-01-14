import { DataSource } from "typeorm";
import { Sniffer } from "./entities/Sniffer";
import { ApiKey } from "./entities/ApiKey";
import { Endpoint } from "./entities/Endpoint";
import { Users } from "./entities/Users";
import { Chat } from "./entities/Chat";
import { Message } from "./entities/Message";
import { Request } from "./entities/Request";
import { Response } from "./entities/Response";
import { TestSuite } from "./entities/TestSuite";
import { TestExecution } from "./entities/TestExecution";
import { Test } from "./entities/Test";
import { Mock } from "./entities/Mock";
import { Workspace } from "./entities/Workspace";
import { config } from "dotenv";
import { MockResponse } from "./entities/MockResponse";
import { WorkspacesUsers } from "./entities/WorkspacesUsers";

config({
  path: "../.env",
});

export const createConnection = () => {
  return new DataSource({
    name: "default",
    type: "postgres",
    database: process.env.DB_NAME,
    synchronize: false,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? "5432"),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    logging: process.env.LOG_SQL == "true" ?? false,
    entities: [
      Users,
      Sniffer,
      Test,
      ApiKey,
      Endpoint,
      Chat,
      Message,
      Request,
      TestSuite,
      TestExecution,
      Response,
      Mock,
      MockResponse,
      Workspace,
      WorkspacesUsers,
      Response,
    ],
    subscribers: [],
    migrations: ["migrations/*.ts"],
  });
};
