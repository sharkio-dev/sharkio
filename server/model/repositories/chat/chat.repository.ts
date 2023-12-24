import { DataSource, Repository } from "typeorm";
import { Chat } from "../../entities/Chat";

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
