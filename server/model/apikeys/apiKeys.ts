interface ApiKey {
  id: string;
  key: string;
  name: string;
  userId: string;
}

class ApiKeyDataLayer {
  protected keys: ApiKey[];

  constructor() {
    this.keys = [
      { id: "1", key: "123", name: "test", userId: "userId" },
      { id: "2", key: "456", name: "test2", userId: "userId" },
    ];
  }

  getAll(userId: string) {
    return this.keys.filter((key) => key.userId === userId);
  }

  add(userId: string, name?: string) {
    this.keys.push({
      id: "3",
      key: "789",
      name: name || "test3",
      userId,
    });
    return {
      id: "3",
      key: "789",
      name: name || "test3",
      userId,
    };
  }

  remove(userId: string, apiKeyId: string) {
    this.keys = this.keys.filter(
      (key) => key.id !== apiKeyId || key.userId !== userId,
    );
    return true;
  }

  update(userId: string, apiKeyId: string, name: string) {
    this.keys = this.keys.map((key) => {
      if (key.id === apiKeyId) {
        return { ...key, name };
      }
      return key;
    });
    return true;
  }
}

export default ApiKeyDataLayer;
