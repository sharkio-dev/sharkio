import {
  Column,
  DataSource,
  Entity,
  PrimaryGeneratedColumn,
  Repository,
} from "typeorm";
import { useLog } from "../../lib/log";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

@Entity({ name: "request" })
export class Endpoint {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "updated_at" })
  updatedAt: Date;

  @Column({ name: "user_id" })
  userId: string;

  @Column({ name: "sniffer_id" })
  snifferId: string;

  @Column()
  url: string;

  @Column()
  method: string;

  @Column({ type: "varchar" })
  body: Record<string, any>;

  @Column({ type: "varchar" })
  headers: Record<string, any>;
}

export class EndpointRepository {
  repository: Repository<Endpoint>;

  constructor(private readonly appDataSource: DataSource) {
    this.repository = appDataSource.manager.getRepository(Endpoint);
  }
}
