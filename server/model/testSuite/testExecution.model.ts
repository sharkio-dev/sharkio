import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TestExecution {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "test_id" })
  testId: number;

  @Column({ name: "test_request_id" })
  testRequestId: number;

  @Column({ name: "test_response_id" })
  testResponseId: number;
}
