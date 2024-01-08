import { DataSource, In, Repository } from "typeorm";
import { Sniffer } from "../entities/Sniffer";

export class SnifferRepository {
  repository: Repository<Sniffer>;

  constructor(private readonly appDataSource: DataSource) {
    this.repository = appDataSource.manager.getRepository(Sniffer);
  }

  findByDownstream(url: string) {
    return this.repository.findOne({ where: { downstreamUrl: url } });
  }

  findByUserId(userId: string) {
    return this.repository.find({
      where: { userId },
      order: { createdAt: "ASC" },
    });
  }

  findBySubdomain(subdomain: string) {
    return this.repository.findOneBy({ subdomain });
  }

  findByName(userId: string, name: string) {
    return this.repository.findOne({ where: { userId, name } });
  }

  findByPorts(userId: string, ports: number[]) {
    return this.repository.find({ where: { userId, port: In(ports) } });
  }
}
