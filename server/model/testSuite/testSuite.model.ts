import {
  Column,
  DataSource,
  Entity,
  PrimaryGeneratedColumn,
  Repository,
} from "typeorm";

@Entity()
export class TestSuite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "user_id" })
  userId: string;
}

export class TestSuiteRepository {
  private readonly repository: Repository<TestSuite>;

  constructor(private readonly appDataSource: DataSource) {
    this.repository = this.appDataSource.getRepository(TestSuite);
  }

  getByuserId(userId: string) {
    return this.repository.find({ where: { userId } });
  }

  async create(name: string, userId: string): Promise<TestSuite> {
    const newTestSuite = this.repository.create({ name, userId });
    return this.repository.save(newTestSuite);
  }
}
