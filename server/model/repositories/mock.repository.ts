import { DataSource, Repository } from "typeorm";
import { Mock } from "../entities/Mock";
import { useLog } from "../../lib/log";

const logger = useLog({
  dirname: __dirname,
  filename: __filename,
});

export class MockRepository {
  repository: Repository<Mock>;

  constructor(private readonly appDataSource: DataSource) {
    this.repository = this.appDataSource.manager.getRepository(Mock);
  }

  getById(ownerId: string, mockId: string) {
    return this.repository.findOne({
      where: { ownerId, id: mockId },
      relations: {
        mockResponses: true,
      },
    });
  }

  getByUser(ownerId: string, limit: number) {
    return this.repository.find({
      where: { ownerId },
      take: limit,
      relations: {
        mockResponses: true,
      },
      order: { createdAt: "DESC" },
    });
  }

  getBySnifferId(ownerId: string, snifferId: string) {
    return this.repository.find({
      where: { ownerId, snifferId },
      order: { createdAt: "DESC" },
      relations: {
        mockResponses: true,
      },
    });
  }

  async getByUrl(
    ownerId: string,
    snifferId: string,
    url: string,
    method: string,
  ) {
    logger.verbose("getByUrl: searching", { ownerId, snifferId, url, method });

    const exact = await this.repository.findOne({
      where: { ownerId, url, snifferId, method },
      order: { createdAt: "DESC" },
      relations: {
        mockResponses: true,
      },
    });
    if (exact) {
      logger.verbose("getByUrl: exact match hit", {
        mockId: exact.id,
        mockUrl: exact.url,
      });
      return exact;
    }

    const candidates = await this.repository.find({
      where: { ownerId, snifferId, method },
      order: { createdAt: "DESC" },
      relations: {
        mockResponses: true,
      },
    });
    logger.verbose("getByUrl: no exact match, trying regex", {
      url,
      method,
      candidateCount: candidates.length,
      candidateUrls: candidates.map((m) => m.url),
    });
    for (const mock of candidates) {
      let re: RegExp;
      try {
        re = new RegExp(`^${mock.url}$`);
      } catch (err) {
        logger.verbose("getByUrl: regex compile failed, skipping", {
          mockId: mock.id,
          mockUrl: mock.url,
          error: (err as Error).message,
        });
        continue;
      }
      const matched = re.test(url);
      logger.verbose("getByUrl: regex test", {
        mockId: mock.id,
        mockUrl: mock.url,
        url,
        matched,
      });
      if (matched) return mock;
    }
    logger.verbose("getByUrl: no match found", { url, method });
    return null;
  }

  deleteById(ownerId: string, mockId: string) {
    return this.repository
      .createQueryBuilder()
      .delete()
      .from(Mock)
      .where("id = :mockId AND ownerId = :ownerId", { ownerId, mockId })
      .execute();
  }

  setDefaultResponse(ownerId: string, mockId: string, responseId: string) {
    return this.repository.update(
      { ownerId, id: mockId },
      { selectedResponseId: responseId },
    );
  }
}
