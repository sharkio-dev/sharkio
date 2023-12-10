import {
  Column,
  DataSource,
  Entity,
  PrimaryGeneratedColumn,
  Repository,
} from "typeorm";

@Entity({ name: "test_flow" })
export class TestFlow {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: "test_suite_id" })
  testSuiteId: string;

  @Column({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "updated_at" })
  updatedAt: Date;
}

export class TestFlowRepository {
  private readonly repository: Repository<TestFlow>;

  constructor(private readonly appDataSource: DataSource) {
    this.repository = this.appDataSource.getRepository(TestFlow);
  }

  create(testSuiteId: string) {
    const createdTestFlow = this.repository.create({
      testSuiteId,
    });
    return this.repository.save(createdTestFlow);
  }
}
