import { DataSource, Repository } from "typeorm";
import { Response } from "../entities/Response";

export class ResponseRepository {
  repository: Repository<Response>;

  constructor(private readonly appDataSource: DataSource) {
    this.repository = appDataSource.manager.getRepository(Response);
  }
}
