import { DataSource } from "typeorm";
import { Sniffer } from "../model/sniffer/sniffers.model";
import { ApiKey } from "../model/apikeys/apiKeys.model";
import { InterceptedRequest } from "../model/request/request.model";
import { User } from "../model/user/user.model";
import { Invocation } from "../model/invocation/invocation.model";
import { InterceptedResponse } from "../model/response/response.model";

const appDataSource: { pg: DataSource | undefined } = { pg: undefined };

export const getAppDataSource = async () => {
  if (!appDataSource.pg) {
    const dataSource = new DataSource({
      type: "postgres",
      url: process.env.DATABASE_URL,
      synchronize: false,
      logging: false,
      entities: [
        Sniffer,
        ApiKey,
        InterceptedRequest,
        User,
        Invocation,
        InterceptedResponse,
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
