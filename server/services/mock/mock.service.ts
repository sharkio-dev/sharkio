import { useLog } from "../../lib/log";
import { Mock } from "../../model/entities/Mock";
import { MockResponse } from "../../model/entities/MockResponse";
import { MockResponseRepository } from "../../model/repositories/mock-response.repository";
import { MockRepository } from "../../model/repositories/mock.repository";
import { RequestRepository } from "../../model/repositories/request.repository";
import { FileConfigWriterService } from "../file-config-writer/file-config-writer.service";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});
export class MockService {
  constructor(
    private readonly mockRepository: MockRepository,
    private readonly mockResponseRepository: MockResponseRepository,
    private readonly configWriter?: FileConfigWriterService,
  ) {}

  async import(
    snifferId: string,
    url: string,
    method: string,
    body: string,
    headers: Record<string, string>,
    status: number,
    ownerId: string,
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
        ownerId,
        url,
        method,
        body,
        headers,
        status,
        "imported-response",
        snifferId,
      );
      const mockResponse = await this.mockResponseRepository.create(
        ownerId,
        newMock.id,
        {
          body,
          headers,
          status,
          name: "imported-response",
          snifferId,
          ownerId,
        },
      );
      await this.setSelectedResponse(ownerId, newMock.id, mockResponse.id);
      await this.configWriter?.writeForSniffer(ownerId, snifferId);
      return newMock;
    } else {
      await this.mockResponseRepository.create(ownerId, mock.id, {
        body,
        headers,
        status,
        name: "imported-response",
        snifferId,
        ownerId,
      });
      await this.configWriter?.writeForSniffer(ownerId, snifferId);
      return mock;
    }
  }

  getById(ownerId: string, mockId: string) {
    return this.mockRepository.getById(ownerId, mockId);
  }

  getByUrl(
    ownerId: string,
    mockId: string,
    url: string,
    method: string,
  ): Promise<Mock | null> {
    return this.mockRepository.getByUrl(ownerId, mockId, url, method);
  }

  getByUser(ownerId: string, limit: number) {
    return this.mockRepository.getByUser(ownerId, limit);
  }

  getBySnifferId(ownerId: string, snifferId: string) {
    return this.mockRepository.getBySnifferId(ownerId, snifferId);
  }

  async create(
    ownerId: string,
    url: string,
    method: string,
    body: string,
    headers: Record<string, string>,
    status: number,
    name: string,
    snifferId: string,
    mockResponses?: MockResponse[],
    selectedResponseId?: string,
    responseSelectionMethod?: string,
  ): Promise<Mock> {
    const createdMock = await this.mockRepository.repository.create({
      url,
      method,
      body,
      headers,
      status,
      ownerId,
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
            ownerId,
            mock.id,
            mappedResponses,
            false,
          );
          savedResponses = await entityManager.save(createdResponses);
        }
      },
    );
    if (selectedResponseId != null && mock != null) {
      await this.setSelectedResponse(ownerId, mock.id, selectedResponseId);
    }
    await this.configWriter?.writeForSniffer(ownerId, snifferId);
    return mock as Mock;
  }

  async update(
    ownerId: string,
    mockId: string,
    url?: string,
    method?: string,
    body?: string,
    headers?: Record<string, string>,
    status?: number,
    name?: string,
    snifferId?: string,
    responseSelectionMethod?: string,
  ) {
    const result = await this.mockRepository.repository
      .createQueryBuilder()
      .update()
      .where("id = :mockId AND ownerId = :ownerId", { mockId, ownerId })
      .set({
        id: mockId,
        ownerId,
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

    const resolvedSnifferId =
      snifferId ?? result.raw?.[0]?.snifferId;
    if (resolvedSnifferId) {
      await this.configWriter?.writeForSniffer(ownerId, resolvedSnifferId);
    }
    return result;
  }

  async delete(ownerId: string, mockId: string) {
    const mock = await this.mockRepository.repository.findOne({
      where: { ownerId, id: mockId },
      select: ["snifferId"],
    });
    const result = await this.mockRepository.deleteById(ownerId, mockId);
    if (mock?.snifferId) {
      await this.configWriter?.writeForSniffer(ownerId, mock.snifferId);
    }
    return result;
  }

  async setIsActive(ownerId: string, mockId: string, isActive: boolean) {
    const result = await this.mockRepository.repository
      .createQueryBuilder()
      .update()
      .where("id = :mockId AND ownerId = :ownerId", { mockId, ownerId })
      .set({ isActive })
      .returning("*")
      .execute();

    const snifferId = result.raw?.[0]?.snifferId;
    if (snifferId) {
      await this.configWriter?.writeForSniffer(ownerId, snifferId);
    }
    return result;
  }

  async setSelectedResponse(
    ownerId: string,
    mockId: string,
    responseId: string,
  ) {
    const result = await this.mockRepository.repository
      .createQueryBuilder()
      .update()
      .where("id = :mockId AND ownerId = :ownerId", { mockId, ownerId })
      .set({ id: mockId, ownerId, selectedResponseId: responseId })
      .returning("*")
      .execute();

    const snifferId = result.raw?.[0]?.snifferId;
    if (snifferId) {
      await this.configWriter?.writeForSniffer(ownerId, snifferId);
    }
    return result;
  }
}
