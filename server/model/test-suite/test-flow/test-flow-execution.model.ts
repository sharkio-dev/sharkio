// import { Column, DataSource, Entity, Repository } from "typeorm";

// @Entity()
// export class TestFlowExecution {
//   @Column()
//   flowId: string;

//   @Column()
//   currentNodeId: string;

//   @Column()
//   status: string;

//   @Column({ type: "json" })
//   report: Object;

//   @Column({ name: "created_at" })
//   createdAt: Date;

//   @Column({ name: "updated_at" })
//   updatedAt: Date;
// }

// export class TestFlowExecutionRepository {
//   private readonly repository: Repository<TestFlowExecution>;

//   constructor(private readonly appDataSource: DataSource) {
//     this.repository = this.appDataSource.getRepository(TestFlowExecution);
//   }
// }
