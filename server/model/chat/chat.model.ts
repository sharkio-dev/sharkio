import { Column, DataSource, Entity, PrimaryColumn, Repository } from "typeorm";

@Entity({ name: "chat" })
export class Chat {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ name: "user_id" })
  userId: string;

  @Column()
  title: string;

  @Column({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "updated_at" })
  updatedAt: Date;
}

class ChatRepository {
  repository: Repository<Chat>;
  constructor(private readonly appDataSource: DataSource) {
    this.repository = appDataSource.manager.getRepository(Chat);
  }

  getById(id: string) {
    return this.repository.findOne({ where: { id } });
  }
}

export default ChatRepository;
