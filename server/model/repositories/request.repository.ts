import { DataSource, Repository } from "typeorm";
import { Request } from "../entities/Request";

export class RequestRepository {
  repository: Repository<Request>;

  constructor(private readonly appDataSource: DataSource) {
    this.repository = appDataSource.manager.getRepository(Request);
  }
}
