import { Column, Entity, PrimaryColumn, Repository } from "typeorm";
import crypto from "crypto";
import { getAppDataSource } from "../../server/app-data-source";
import { DataSource } from "typeorm/browser";

enum ApiKeyStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

@Entity()
export class ApiKey {
  @PrimaryColumn("uuid")
  id: string;

  @Column()
  key: string;

  @Column()
  name: string;

  @Column()
  userId: string;

  @Column({ type: "enum", enum: ApiKeyStatus, default: ApiKeyStatus.ACTIVE })
  status: ApiKeyStatus;
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
}

export default ApiKeyRepository;
