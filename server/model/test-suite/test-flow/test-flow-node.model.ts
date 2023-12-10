import {
  Column,
  DataSource,
  Entity,
  PrimaryGeneratedColumn,
  Repository,
} from "typeorm";

@Entity({ name: "test_flow_node" })
export class TestFlowNode {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: "flow_id" })
  flowId: string;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column()
  body: string;

  @Column({ type: "varchar" })
  headers: Record<string, any>;

  @Column()
  method: string;

  @Column({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "updated_at" })
  updatedAt: Date;
}

export class TestFlowNodeRepository {
  private readonly repository: Repository<TestFlowNode>;

  constructor(private readonly appDataSource: DataSource) {
    this.repository = this.appDataSource.getRepository(TestFlowNode);
  }

  create(testFlowNode: Partial<TestFlowNode>) {
    const node = this.repository.create(testFlowNode);
    return this.repository.save(node);
  }
}
