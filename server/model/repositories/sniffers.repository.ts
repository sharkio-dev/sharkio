import { DataSource, In, Repository } from "typeorm";
import { Sniffer } from "../entities/Sniffer";

export class SnifferRepository {
  repository: Repository<Sniffer>;

  constructor(private readonly appDataSource: DataSource) {
    this.repository = appDataSource.manager.getRepository(Sniffer);
  }
  getById(ownerId: string, id: string) {
    return this.repository.findOne({
      where: {
        ownerId,
        id,
      },
    });
  }
  findByDownstream(url: string) {
    return this.repository.findOne({ where: { downstreamUrl: url } });
  }

  async findByUserId(ownerId: string) {
    const res = await this.repository.find({
      where: { ownerId },
      order: { createdAt: "ASC" },
    });

    return res;
  }

  findBySubdomain(subdomain: string) {
    return this.repository.findOneBy({ subdomain });
  }

  findByName(ownerId: string, name: string) {
    return this.repository.findOne({ where: { ownerId, name } });
  }

  findByPorts(ownerId: string, ports: number[]) {
    return this.repository.find({ where: { ownerId, port: In(ports) } });
  }
}
