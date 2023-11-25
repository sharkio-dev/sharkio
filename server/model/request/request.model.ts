import {
  Column,
  DataSource,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Repository,
} from "typeorm";
import { useLog } from "../../lib/log";
import { Response } from "../response/response.model";
import { TestExecution } from "../testSuite/testExecution.model";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

@Entity({ name: "request" })
export class Request {
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

  @Column({ name: "endpoint_id" })
  endpointId: string;

  @Column()
  url: string;

  @Column()
  method: string;

  @Column()
  body: string;

  @Column({ type: "varchar" })
  headers: Record<string, any>;

  @OneToMany("response", "request")
  @JoinColumn({ name: "id" })
  response: Response[];

  @ManyToOne(() => TestExecution, (testExecution) => testExecution.request)
  @JoinColumn({ name: "test_execution_id" })
  testExecution: TestExecution;

  @Column({ name: "test_execution_id" })
  testExecutionId?: string;
}

export class RequestRepository {
  repository: Repository<Request>;

  constructor(private readonly appDataSource: DataSource) {
    this.repository = appDataSource.manager.getRepository(Request);
  }
}
