import ChatRepository from "../../model/chat/chat.model";
import MessageRepository from "../../model/chat/message.model";

import { v4 } from "uuid";

export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly messageRepository: MessageRepository,
  ) {}

  async loadMessagesByChatId(chatId: string) {
    return await this.messageRepository.getByChatId(chatId);
  }

  async newChat(userId: string) {
    const chat = await this.chatRepository.repository.create({
      id: v4(),
      title: "new chat",
      userId,
    });

    return this.chatRepository.repository.save(chat);
  }

  async addUserMessage(userId: string, chatId: string, content: string) {
    return this.messageRepository.addMessage(userId, chatId, content, "user");
  }

  async addSystemMessage(userId: string, chatId: string, content: string) {
    return this.messageRepository.addMessage(userId, chatId, content, "system");
  }
}
