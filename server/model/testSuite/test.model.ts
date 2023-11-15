import {
  Column,
  DataSource,
  Entity,
  PrimaryGeneratedColumn,
  Repository,
} from "typeorm";
import { Rule } from "./types";

export class TestRepository {
  private readonly repository: Repository<Test>;

  constructor(private readonly appDataSource: DataSource) {
    this.repository = this.appDataSource.getRepository(Test);
  }

  getByTestSuiteId(testSuiteId: string) {
    return this.repository.find({ where: { testSuiteId } });
  }

  updateById(
    id: string,
    test: {
      name?: string;
      url?: string;
      body?: Record<string, any>;
      headers?: Record<string, any>;
      method?: string;
      rules?: Rule[];
    },
  ) {
    return this.repository.update(id, test);
  }

  async create(
    name: string,
    testSuiteId: string,
    snifferId: string,
    url: string,
    body: Record<string, any>,
    headers: Record<string, any>,
    method: string,
    rules?: Rule[],
  ): Promise<Test> {
    const newTest = this.repository.create({
      name,
      testSuiteId,
      snifferId,
      url,
      body,
      headers,
      method,
      rules: rules || [],
    });
    return this.repository.save(newTest);
  }

  getById(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  deleteById(id: string) {
    return this.repository.delete(id);
  }
}

@Entity()
export class Test {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "test_suite_id" })
  testSuiteId: string;

  @Column({ name: "sniffer_id" })
  snifferId: string;

  @Column()
  url: string;

  @Column({ type: "varchar" })
  body: Record<string, any>;

  @Column({ type: "varchar" })
  headers: Record<string, any>;

  @Column()
  method: string;

  @Column({ type: "json" })
  rules: Rule[];
}

/*
 * 
Rules:
List of rules that will be applied to the response of the request.

Each rule has the following properties:
{
  type: status_code | body | header,
  comparator: equals | not_equals | contains | not_contains | matches | not_matches,
  targetPath: string,
  expectedValue: string,
 }

 Example:
  {
    type: "status_code",
    comparator: "equals",
    targetPath: "",
    expectedValue: "200",
  },
Example:
  {
    type: "body",
    comparator: "contains",
    targetPath: "data",
    expectedValue: { name: "John" },
  },
Example:
  {
    type: "header",
    comparator: "equals",
    targetPath: "content-type",
    expectedValue: "application/json",
  },
 */
