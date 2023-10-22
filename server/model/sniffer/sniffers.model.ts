import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Repository,
} from "typeorm";
import { useLog } from "../../lib/log";
import { DataSource } from "typeorm";

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

  @Column()
  port: number;

  @Column({ name: "downstream_url" })
  downstreamUrl: string;

  @Column({ name: "user_id" })
  userId: string;
}
