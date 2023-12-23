import ApiKeyRepository from "../../model/repositories/apiKeys.model";
import UserRepository from "../../model/repositories/user.model";

class APIKeysService {
  constructor(
    private readonly repository: ApiKeyRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getAll(userId: string) {
    return this.repository.getAll(userId);
  }

  async add(userId: string, name: string) {
    return this.repository.add(userId, name);
  }

  async get(key: string) {
    return this.repository.get(key);
  }

  async remove(userId: string, apiKey: string) {
    return this.repository.remove(userId, apiKey);
  }

  async update(userId: string, apiKey: string, name: string) {
    return this.repository.update(userId, apiKey, name);
  }

  async validate(key: string, email: string) {
    const user = await this.userRepository.getByEmail(email);
    if (!user) {
      return false;
    }
    return await this.repository.validate(key, user.id);
  }
}

export default APIKeysService;
