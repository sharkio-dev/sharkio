import ApiKeyDataLayer from "../../model/apikeys/apiKeys";

class APIKeysService {
  private apiKeyDataLayer: ApiKeyDataLayer;

  constructor() {
    this.apiKeyDataLayer = new ApiKeyDataLayer();
  }

  getAll(userId: string) {
    return this.apiKeyDataLayer.getAll(userId);
  }

  add(userId: string, name: string) {
    return this.apiKeyDataLayer.add(userId, name);
  }

  remove(userId: string, apiKey: string) {
    return this.apiKeyDataLayer.remove(userId, apiKey);
  }

  update(userId: string, apiKey: string, name: string) {
    return this.apiKeyDataLayer.update(userId, apiKey, name);
  }
}

export default APIKeysService;
