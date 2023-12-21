import {
  Column,
  DataSource,
  Entity,
  In,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Repository,
} from "typeorm";
import { Test } from "./test.model";
import { Request } from "../request/request.model";

@Entity()
export class TestExecution {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "test_id" })
  testId: string;

  @Column({ type: "json" })
  checks?: any;

  @ManyToOne(() => Test, (test) => test.id)
  @JoinColumn({ name: "test_id" })
  test: Test;

  @OneToMany(() => Request, (request) => request.testExecution)
  request: Request[];
}

export class TextExecutionRepository {
  private readonly repository: Repository<TestExecution>;

  constructor(private readonly appDataSource: DataSource) {
    this.repository = this.appDataSource.getRepository(TestExecution);
  }

  create(testId: string) {
    return this.repository.save({
      testId,
    });
  }

  getByTestId(testIds: string[]) {
    return this.repository.find({
      where: { testId: In(testIds) },
      relations: {
        test: true,
        request: {
          response: true,
        },
      },
      order: {
        createdAt: "DESC",
      },
    });
  }

  deleteByTestId(testId: string) {
    return this.repository.delete({ testId });
  }

  update(testId: string, checks: any) {
    return this.repository.update({ id: testId }, { checks });
  }
}
