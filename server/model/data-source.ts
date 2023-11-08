import { DataSource } from "typeorm";
import env from "dotenv/config";
import { Sniffer } from "./sniffer/sniffers.model";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST ?? "localhost",
  port: +(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? "postgres",
  password: process.env.DB_PASSWORD ?? "postgres",
  database: process.env.DB_NAME ?? "test",
  synchronize: false,
  logging: true,
  entities: [Sniffer],
  subscribers: [],
  migrations: [],
});
