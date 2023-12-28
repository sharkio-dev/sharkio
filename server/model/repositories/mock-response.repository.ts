import { DataSource, Repository } from "typeorm";
import { MockResponse } from "../entities/MockResponse";

export class MockResponseRepository {
  repository: Repository<MockResponse>;

  constructor(private readonly appDataSource: DataSource) {
    this.repository = appDataSource.manager.getRepository(MockResponse);
  }

  getByUserId(userId: string) {
    return this.repository.find({
      where: {
        userId,
      },
    });
  }

  getByMockId(userId: string, mockId: string) {
    return this.repository.find({
      where: { userId, mockId },
      order: { createdAt: "DESC" },
    });
  }

  getById(userId: string, mockResponseId: string) {
    return this.repository.findOne({
      where: { userId: userId, id: mockResponseId },
    });
  }

  deleteById(userId: string, mockResponseId: string) {
    return this.repository.delete({ id: mockResponseId, userId });
  }

  editById(
    userId: string,
    mockResponseId: string,
    mockResponse: Partial<MockResponse>
  ) {
    return this.repository.update(
      {
        userId,
        id: mockResponseId,
      },
      mockResponse
    );
  }

  create(
    userId: string,
    mockId: string,
    mockResponse: Omit<
      MockResponse,
      "id" | "createdAt" | "updatedAt" | "mockId" | "mock" | "sequenceIndex"
    >
  ) {
    return this.repository.manager.transaction(async (entityManager) => {
      const responseCount = await entityManager.count(MockResponse, {
        where: {
          userId,
          mockId,
        },
      });

      const createdResponse = entityManager.create<MockResponse>(MockResponse, {
        ...mockResponse,
        userId,
        mockId,
        sequenceIndex: responseCount + 1,
      });

      return entityManager.save(createdResponse);
    });
  }
}
