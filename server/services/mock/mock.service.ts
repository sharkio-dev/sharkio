import { useLog } from "../../lib/log";
import { Mock } from "../../model/entities/Mock";
import { MockResponse } from "../../model/entities/MockResponse";
import { MockRepository } from "../../model/repositories/mock.repository";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});
export class MockService {
  constructor(private readonly mockRepository: MockRepository) {}

  getById(userId: string, mockId: string) {
    return this.mockRepository.getById(userId, mockId);
  }

  getByUrl(
    userId: string,
    mockId: string,
    url: string,
    method: string,
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
  ) {
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
    });

    return this.mockRepository.repository.save(createdMock);
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
}
