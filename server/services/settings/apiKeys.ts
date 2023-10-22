import ApiKeyRepository from "../../model/apikeys/apiKeys.model";

class APIKeysService {
  constructor(private readonly repository: ApiKeyRepository) {}

  async getAll(userId: string) {
    return this.repository.getAll(userId);
  }

  async add(userId: string, name: string) {
    return this.repository.add(userId, name);
  }

  async remove(userId: string, apiKey: string) {
    return this.repository.remove(userId, apiKey);
  }

  async update(userId: string, apiKey: string, name: string) {
    return this.repository.update(userId, apiKey, name);
  }
}

export default APIKeysService;
