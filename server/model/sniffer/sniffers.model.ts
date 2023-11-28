import {
  Column,
  DataSource,
  Entity,
  In,
  PrimaryGeneratedColumn,
  Repository,
} from "typeorm";
import { useLog } from "../../lib/log";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

export class SnifferRepository {
  repository: Repository<Sniffer>;

  constructor(private readonly appDataSource: DataSource) {
    this.repository = appDataSource.manager.getRepository(Sniffer);
  }

  findByUserId(userId: string) {
    return this.repository.findBy({ userId });
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

@Entity()
export class Sniffer {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "updated_at" })
  updatedAt: Date;

  @Column({ name: "downstream_url" })
  downstreamUrl: string;

  @Column({ name: "user_id" })
  userId: string;

  @Column()
  subdomain: string;

  @Column()
  port: number;
}
