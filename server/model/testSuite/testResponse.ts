import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TestResponse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "created_at" })
  createdAt: Date;

  @Column({ type: "varchar" })
  body: Record<string, any>;

  @Column({ type: "varchar" })
  headers: Record<string, any>;

  @Column()
  statusCode: number;
}
