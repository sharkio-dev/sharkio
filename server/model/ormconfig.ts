import { DataSource } from "typeorm";

export const appDataSource = new DataSource({
  name: "default",
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "mysecretpassword",
  database: "postgres",
  synchronize: true,
  entities: ["entities/*.ts"],
  migrations: ["migrations/*.ts"],
});
