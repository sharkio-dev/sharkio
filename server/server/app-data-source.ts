import { DataSource } from "typeorm";
import { Sniffer } from "../model/sniffer/sniffers.model";
import { ApiKey } from "../model/apikeys/apiKeys.model";
import { Endpoint } from "../model/endpoint/endpoint.model";
import { User } from "../model/user/user.model";
import { Invocation } from "../model/invocation/invocation.model";
import { InterceptedResponse } from "../model/response/response.model";
import { TestSuite } from "../model/testSuite/testSuite.model";
import { Test } from "../model/testSuite/test.model";
import { TestExecution } from "../model/testSuite/testExecution.model";
import { TestRequest } from "../model/testSuite/testRequest";
import { TestResponse } from "../model/testSuite/testResponse";

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
        Invocation,
        InterceptedResponse,
        TestSuite,
        Test,
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
