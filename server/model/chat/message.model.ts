import { Column, DataSource, Entity, PrimaryColumn, Repository } from "typeorm";

@Entity({ name: "message" })
export class Message {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ name: "user_id" })
  userId: string;

  @Column({ name: "chat_id" })
  chatId: string;

  @Column()
  content: string;

  @Column({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "updated_at" })
  updatedAt: Date;
}

class MessageRepository {
  repository: Repository<Message>;
  constructor(private readonly appDataSource: DataSource) {
    this.repository = this.appDataSource.manager.getRepository(Message);
  }

  getByChatId(chatId: string) {
    return this.repository.findOne({
      where: { chatId },
      order: {
        createdAt: "DESC",
      },
    });
  }

  addMessage(userId: string, chatId: string, content: string) {
    const message = this.repository.create({
      chatId,
      content,
      userId,
    });

    return this.repository.save(message);
  }
}

export default MessageRepository;
