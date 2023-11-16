import {
  Column,
  DataSource,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Repository,
} from "typeorm";
import { useLog } from "../../lib/log";
import { Request } from "../request/request.model";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

@Entity({ name: "response" })
export class Response {
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

  @Column({ name: "request_id" })
  requestId: string;

  @Column({ type: "varchar" })
  body: Record<string, any>;

  @Column({ type: "varchar" })
  headers: Record<string, any>;

  @Column({ type: "int" })
  status: number;

  @ManyToOne("request", "response")
  @JoinColumn({ name: "request_id" })
  request: Request;

  @Column({ name: "test_execution_id" })
  testExecutionId?: string;
}

export class ResponseRepository {
  repository: Repository<Response>;

  constructor(private readonly appDataSource: DataSource) {
    this.repository = appDataSource.manager.getRepository(Response);
  }
}
