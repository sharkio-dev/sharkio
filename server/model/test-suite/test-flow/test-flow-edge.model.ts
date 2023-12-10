import {
  Column,
  DataSource,
  Entity,
  PrimaryGeneratedColumn,
  Repository,
} from "typeorm";

@Entity({ name: "test_flow_edge" })
export class TestFlowEdge {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: "flow_id" })
  flowId: string;

  @Column({ name: "source_node_id" })
  sourceNodeId: string;

  @Column({ name: "target_node_id" })
  targetNodeId: string;

  @Column({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "updated_at" })
  updatedAt: Date;
}

export class TestFlowEdgeRepository {
  private readonly repository: Repository<TestFlowEdge>;

  constructor(private readonly appDataSource: DataSource) {
    this.repository = this.appDataSource.getRepository(TestFlowEdge);
  }
  create(edge: Partial<TestFlowEdge>) {
    const created = this.repository.create(edge);
    return this.repository.save(created);
  }
}
