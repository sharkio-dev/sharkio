import { DataSource, Repository } from "typeorm";
import { Mock } from "../entities/Mock";

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

  getByUrl(ownerId: string, snifferId: string, url: string, method: string) {
    return this.repository.findOne({
      where: { ownerId, url, snifferId, method },
      order: { createdAt: "DESC" },
      relations: {
        mockResponses: true,
      },
    });
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
