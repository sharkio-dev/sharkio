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

  @Column()
  name: string;

  @Column({ name: "user_id" })
  userId: string;

  @Column({ name: "sniffer_id" })
  snifferId: string;

  @Column()
  method: string;

  @Column()
  url: string;

  @Column()
  body: string;

  @Column()
  headers: string;

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

  getById(userId: string, mockId: string) {
    return this.repository.findOne({
      where: { userId: userId, id: mockId },
    });
  }
  getByUser(userId: string, limit: number) {
    return this.repository.find({ where: { userId: userId }, take: limit });
  }

  deleteById(userId: string, mockId: string) {
    return this.repository
      .createQueryBuilder()
      .delete()
      .from(Mock)
      .where("id = :mockId AND userId = :userId", { userId, mockId })
      .execute();
  }
}
