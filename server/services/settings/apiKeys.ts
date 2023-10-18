import ApiKeyDataLayer from "../../model/apikeys/apiKeys";

class APIKeysService {
  private apiKeyDataLayer: ApiKeyDataLayer;

  constructor() {
    this.apiKeyDataLayer = new ApiKeyDataLayer();
  }

  async getAll(userId: string) {
    return this.apiKeyDataLayer.getAll(userId);
  }

  async add(userId: string, apiKey: string) {
    return this.apiKeyDataLayer.add(userId, apiKey);
  }

  async remove(userId: string, apiKey: string) {
    return this.apiKeyDataLayer.remove(userId, apiKey);
  }

  async update(userId: string, apiKey: string, name: string) {
    return this.apiKeyDataLayer.update(userId, apiKey, name);
  }
}

export default APIKeysService;
