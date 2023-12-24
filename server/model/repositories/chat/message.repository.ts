import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { DataSource, Repository } from "typeorm";
import { Message } from "../../entities/Message";

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
        }) as ChatCompletionMessageParam,
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
