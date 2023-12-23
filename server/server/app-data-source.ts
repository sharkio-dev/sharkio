import { DataSource } from "typeorm";
import { Sniffer } from "../model/entities/Sniffer";
import { ApiKey } from "../model/entities/ApiKey";
import { Endpoint } from "../model/entities/Endpoint";
import { User } from "../model/entities/Users";
import { Chat } from "../model/entities/Chat";
import { Message } from "../model/entities/Message";
import { Request } from "../model/entities/Request";
import { Response } from "../model/entities/Response";
import { TestSuite } from "../model/entities/TestSuite";
import { TestExecution } from "../model/entities/TestExecution";
import { Test } from "../model/entities/Test";
import { Mock } from "../model/entities/Mock";
import { Workspace } from "../model/entities/Workspace";

const appDataSource: { pg: DataSource | undefined } = { pg: undefined };

export const getAppDataSource = async () => {
  if (!appDataSource.pg) {
    const dataSource = new DataSource({
      name: "default",
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "mysecretpassword",
      database: "postgres",
      synchronize: false,
      logging: process.env.LOG_SQL == "true" ?? false,
      entities: [
        User,
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
        Workspace,
        Response,
      ],
      subscribers: [],
      migrations: [],
    });
    appDataSource.pg = await dataSource.initialize();
    return appDataSource.pg;
  } else {
    return appDataSource.pg;
  }
};
