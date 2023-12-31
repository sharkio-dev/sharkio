import { useLog } from "../../lib/log";
import { Mock } from "../../model/entities/Mock";
import { MockResponse } from "../../model/entities/MockResponse";
import { MockResponseRepository } from "../../model/repositories/mock-response.repository";
import { MockRepository } from "../../model/repositories/mock.repository";
import { RequestRepository } from "../../model/repositories/request.repository";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});
export class MockService {
  constructor(
    private readonly mockRepository: MockRepository,
    private readonly mockResponseRepository: MockResponseRepository
  ) {}

  async import(
    snifferId: string,
    url: string,
    method: string,
    body: string,
    headers: Record<string, string>,
    status: number,
    userId: string
  ) {
    let mock = await this.mockRepository.repository.findOne({
      where: {
        snifferId,
        url,
        method,
      },
    });
    if (!mock) {
      log.info("Creating mock for imported response");
      const newMock = await this.create(
        userId,
        url,
        method,
        body,
        headers,
        status,
        "imported-response",
        snifferId
      );
      const mockResponse = await this.mockResponseRepository.create(
        userId,
        newMock.id,
        {
          body,
          headers,
          status,
          name: "imported-response",
          snifferId,
          userId,
        }
      );
      await this.setSelectedResponse(userId, newMock.id, mockResponse.id);
      return newMock;
    } else {
      await this.mockResponseRepository.create(userId, mock.id, {
        body,
        headers,
        status,
        name: "imported-response",
        snifferId,
        userId,
      });
      return mock;
    }
  }

  getById(userId: string, mockId: string) {
    return this.mockRepository.getById(userId, mockId);
  }

  getByUrl(
    userId: string,
    mockId: string,
    url: string,
    method: string
  ): Promise<Mock | null> {
    return this.mockRepository.getByUrl(userId, mockId, url, method);
  }

  getByUser(userId: string, limit: number) {
    return this.mockRepository.getByUser(userId, limit);
  }

  getBySnifferId(userId: string, snifferId: string) {
    return this.mockRepository.getBySnifferId(userId, snifferId);
  }

  async create(
    userId: string,
    url: string,
    method: string,
    body: string,
    headers: Record<string, string>,
    status: number,
    name: string,
    snifferId: string,
    mockResponses?: MockResponse[],
    selectedResponseId?: string,
    responseSelectionMethod?: string
  ): Promise<Mock> {
    const createdMock = await this.mockRepository.repository.create({
      url,
      method,
      body,
      headers,
      status,
      userId,
      name,
      snifferId,
      isActive: true,
      responseSelectionMethod,
    });
    let mock: Mock | undefined;

    await this.mockRepository.repository.manager.transaction(
      async (entityManager) => {
        mock = await entityManager.save(createdMock);
        let savedResponses;

        if (mockResponses != null) {
          const mappedResponses = mockResponses.map((response) => ({
            ...response,
            snifferId,
          }));

          const createdResponses = await this.mockResponseRepository.createMany(
            userId,
            mock.id,
            mappedResponses,
            false
          );
          savedResponses = await entityManager.save(createdResponses);
        }
      }
    );
    if (selectedResponseId != null && mock != null) {
      await this.setSelectedResponse(userId, mock.id, selectedResponseId);
    }
    return mock as Mock;
  }

  async update(
    userId: string,
    mockId: string,
    url?: string,
    method?: string,
    body?: string,
    headers?: Record<string, string>,
    status?: number,
    name?: string,
    snifferId?: string,
    responseSelectionMethod?: string
  ) {
    return this.mockRepository.repository
      .createQueryBuilder()
      .update()
      .where("id = :mockId AND userId = :userId", { mockId, userId })
      .set({
        id: mockId,
        userId,
        url,
        method,
        body,
        headers,
        status,
        name,
        snifferId,
        responseSelectionMethod,
      })
      .returning("*")
      .execute();
  }

  delete(userId: string, mockId: string) {
    return this.mockRepository.deleteById(userId, mockId);
  }

  async setIsActive(userId: string, mockId: string, isActive: boolean) {
    return this.mockRepository.repository
      .createQueryBuilder()
      .update()
      .where("id = :mockId AND userId = :userId", { mockId, userId })
      .set({
        isActive,
      })
      .returning("*")
      .execute();
  }

  async setSelectedResponse(
    userId: string,
    mockId: string,
    responseId: string
  ) {
    return this.mockRepository.repository
      .createQueryBuilder()
      .update()
      .where("id = :mockId AND userId = :userId", { mockId, userId })
      .set({
        id: mockId,
        userId,
        selectedResponseId: responseId,
      })
      .returning("*")
      .execute();
  }
}
