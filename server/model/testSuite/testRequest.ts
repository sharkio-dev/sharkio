import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TestRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "test_id" })
  testId: number;

  @Column({ type: "varchar" })
  body: Record<string, any>;

  @Column({ type: "varchar" })
  headers: Record<string, any>;

  @Column()
  method: string;
}
