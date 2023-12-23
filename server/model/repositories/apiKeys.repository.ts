import crypto from "crypto";
import { Repository } from "typeorm";
import { DataSource } from "typeorm/browser";
import { ApiKey } from "../entities/ApiKey";

enum ApiKeyStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

class ApiKeyRepository {
  repository: Repository<ApiKey>;
  constructor(private readonly appDataSource: DataSource) {
    this.repository = appDataSource.manager.getRepository(ApiKey);
  }

  getAll(userId: string) {
    return this.repository
      .find({
        where: { userId, status: ApiKeyStatus.ACTIVE },
      })
      .then((keys) => {
        return keys.map((key) => {
          return { id: key.id, name: key.name, key: key.key.slice(0, 8) };
        });
      });
  }

  get(key: string) {
    return this.repository.findOne({
      where: { key, status: ApiKeyStatus.ACTIVE },
    });
  }

  add(userId: string, name?: string) {
    const user = new ApiKey();
    user.name = name || "";
    user.userId = userId;
    user.status = ApiKeyStatus.ACTIVE;
    user.key = crypto.randomBytes(32).toString("hex");
    return this.repository.save(user);
  }

  remove(userId: string, apiKeyId: string) {
    return this.repository.update(
      { userId, id: apiKeyId },
      { status: ApiKeyStatus.INACTIVE },
    );
  }

  update(userId: string, apiKeyId: string, name: string) {
    return this.repository.update({ userId, id: apiKeyId }, { name });
  }

  async validate(key: string, userId: string) {
    const res = await this.repository.findOne({
      where: { key, status: ApiKeyStatus.ACTIVE, userId },
    });
    return !!res;
  }
}

export default ApiKeyRepository;
