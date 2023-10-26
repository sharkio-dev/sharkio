import { DataSource } from "typeorm";
import { Sniffer } from "../model/sniffer/sniffers.model";
import { ApiKey } from "../model/apikeys/apiKeys.model";
import { InterceptedRequest } from "../model/request/request.model";

const appDataSource: { pg: DataSource | undefined } = { pg: undefined };

export const getAppDataSource = async () => {
  if (!appDataSource.pg) {
    const dataSource = new DataSource({
      type: "postgres",
      url: process.env.DATABASE_URL,
      synchronize: false,
      logging: false,
      entities: [Sniffer, ApiKey, InterceptedRequest],
      subscribers: [],
      migrations: [],
    });
    appDataSource.pg = await dataSource.initialize();
    return appDataSource.pg;
  } else {
    return appDataSource.pg;
  }
};
