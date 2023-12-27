import { DataSource, Repository } from "typeorm";
import { Mock } from "../entities/Mock";

export class MockRepository {
  repository: Repository<Mock>;

  constructor(private readonly appDataSource: DataSource) {
    this.repository = appDataSource.manager.getRepository(Mock);
  }

  getById(userId: string, mockId: string) {
    return this.repository.findOne({
      where: { userId: userId, id: mockId },
      relations: {
        mockResponses: true,
      },
    });
  }

  getByUser(userId: string, limit: number) {
    return this.repository.find({
      where: { userId: userId },
      take: limit,
      relations: {
        mockResponses: true,
      },
      order: { createdAt: "DESC" },
    });
  }

  getBySnifferId(userId: string, snifferId: string) {
    return this.repository.find({
      where: { userId, snifferId },
      order: { createdAt: "DESC" },
      relations: {
        mockResponses: true,
      },
    });
  }

  getByUrl(userId: string, snifferId: string, url: string, method: string) {
    return this.repository.findOne({
      where: { userId, url, snifferId, method },
      order: { createdAt: "DESC" },
      relations: {
        mockResponses: true,
      },
    });
  }

  deleteById(userId: string, mockId: string) {
    return this.repository
      .createQueryBuilder()
      .delete()
      .from(Mock)
      .where("id = :mockId AND userId = :userId", { userId, mockId })
      .execute();
  }

  setDefaultResponse(userId: string, mockId: string, responseId: string) {
    return this.repository.update(
      { userId, id: mockId },
      { selectedResponseId: responseId }
    );
  }
}
