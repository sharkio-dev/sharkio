import { DataSource } from "typeorm";
import { Sniffer } from "../model/sniffer/sniffers.model";
import { ApiKey } from "../model/apikeys/apiKeys.model";
import { Endpoint } from "../model/endpoint/endpoint.model";
import { User } from "../model/user/user.model";
import { Chat } from "../model/chat/chat.model";
import { Message } from "../model/chat/message.model";
import { Request } from "../model/request/request.model";
import { Response } from "../model/response/response.model";
import { TestSuite } from "../model/testSuite/testSuite.model";
import { Test } from "../model/testSuite/test.model";
import { TestExecution } from "../model/testSuite/testExecution.model";
import { Mock } from "../model/mock/mock.model";
import { Workspace } from "../model/workSpace/workSpace.model";

const appDataSource: { pg: DataSource | undefined } = { pg: undefined };

export const getAppDataSource = async () => {
  if (!appDataSource.pg) {
    const dataSource = new DataSource({
      type: "postgres",
      url: process.env.DATABASE_URL,
      synchronize: false,
      logging: process.env.LOG_SQL == "true" ?? false,
      entities: [
        Sniffer,
        ApiKey,
        Endpoint,
        User,
        Chat,
        Message,
        Request,
        Response,
        TestSuite,
        TestExecution,
        Test,
        Response,
        Mock,
        Workspace,
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
