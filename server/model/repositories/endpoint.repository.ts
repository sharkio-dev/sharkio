import { DataSource, Repository } from "typeorm";
import { Endpoint } from "../entities/Endpoint";

export class EndpointRepository {
  repository: Repository<Endpoint>;

  constructor(private readonly appDataSource: DataSource) {
    this.repository = appDataSource.manager.getRepository(Endpoint);
  }
}
