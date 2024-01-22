import { DataSource, Repository } from "typeorm";
import { MockResponse } from "../entities/MockResponse";

export class MockResponseRepository {
  repository: Repository<MockResponse>;

  constructor(private readonly appDataSource: DataSource) {
    this.repository = appDataSource.manager.getRepository(MockResponse);
  }

  getByUserId(ownerId: string) {
    return this.repository.find({
      where: {
        ownerId,
      },
    });
  }

  getByMockId(ownerId: string, mockId: string) {
    return this.repository.find({
      where: { ownerId, mockId },
      order: { createdAt: "DESC" },
    });
  }

  getById(ownerId: string, mockResponseId: string) {
    return this.repository.findOne({
      where: { ownerId, id: mockResponseId },
    });
  }

  deleteById(ownerId: string, mockResponseId: string) {
    return this.repository.delete({ id: mockResponseId, ownerId });
  }

  editById(
    ownerId: string,
    mockResponseId: string,
    mockResponse: Partial<MockResponse>,
  ) {
    return this.repository.update(
      {
        ownerId,
        id: mockResponseId,
      },
      mockResponse,
    );
  }

  create(
    ownerId: string,
    mockId: string,
    mockResponse: Omit<
      MockResponse,
      "id" | "createdAt" | "updatedAt" | "mockId" | "mock" | "sequenceIndex"
    >,
  ) {
    return this.repository.manager.transaction(async (entityManager) => {
      const responseCount = await entityManager.count(MockResponse, {
        where: {
          ownerId,
          mockId,
        },
      });

      const createdResponse = entityManager.create<MockResponse>(MockResponse, {
        ...mockResponse,
        ownerId,
        mockId,
        sequenceIndex: responseCount + 1,
      });

      return entityManager.save(createdResponse);
    });
  }

  createMany(
    ownerId: string,
    mockId: string,
    mockResponses: Omit<
      MockResponse,
      "id" | "createdAt" | "updatedAt" | "mockId" | "mock" | "sequenceIndex"
    >[],
    shouldSave = true,
  ) {
    return this.repository.manager.transaction(async (entityManager) => {
      const responseCount = await entityManager.count(MockResponse, {
        where: {
          ownerId,
          mockId,
        },
      });

      const createdResponses = mockResponses.map((response, index) => {
        return entityManager.create<MockResponse>(MockResponse, {
          ...response,
          ownerId,
          mockId,
          sequenceIndex: responseCount + index,
        });
      });

      return shouldSave
        ? entityManager.save(createdResponses)
        : createdResponses;
    });
  }
}
