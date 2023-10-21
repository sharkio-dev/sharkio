import ApiKeyRepository from "../../model/apikeys/apiKeys.model";

class APIKeysService {
  repository: ApiKeyRepository;
  constructor() {
    this.repository = new ApiKeyRepository();
  }

  getAll(userId: string) {
    return this.repository.getAll(userId);
  }

  add(userId: string, name: string) {
    return this.repository.add(userId, name);
  }

  remove(userId: string, apiKey: string) {
    return this.repository.remove(userId, apiKey);
  }

  update(userId: string, apiKey: string, name: string) {
    return this.repository.update(userId, apiKey, name);
  }
}

export default APIKeysService;
