import {
  Column,
  DataSource,
  Entity,
  PrimaryGeneratedColumn,
  Repository,
} from "typeorm";

@Entity({ name: "mock" })
export class Mock {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: "user_id" })
  userId: string;

  @Column({ name: "sniffer_id" })
  snifferId: string;

  @Column()
  url: string;

  @Column()
  body: string;

  @Column({ type: "varchar" })
  headers: Record<string, any>;

  @Column()
  status: number;

  @Column({ name: "is_active" })
  isActive: boolean;

  @Column({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "updated_at" })
  updatedAt: Date;
}

export class MockRepository {
  repository: Repository<Mock>;

  constructor(private readonly appDataSource: DataSource) {
    this.repository = appDataSource.manager.getRepository(Mock);
  }

  getByUser(userId: string, limit: number) {
    return this.repository.find({ where: { userId: userId }, take: limit });
  }
}
