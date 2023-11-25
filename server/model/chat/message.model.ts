import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
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

  @Column()
  role: string;

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

  async getByChatId(chatId: string) {
    const messages = await this.repository.find({
      select: {
        role: true,
        content: true,
      },
      where: { chatId },
      order: {
        createdAt: "DESC",
      },
    });

    return messages.map(
      (message) =>
        ({
          role: message.role,
          content: message.content,
        } as ChatCompletionMessageParam)
    );
  }

  addMessage(userId: string, chatId: string, content: string, role: string) {
    const message = this.repository.create({
      chatId,
      content,
      userId,
      role,
    });

    return this.repository.save(message);
  }
}

export default MessageRepository;
