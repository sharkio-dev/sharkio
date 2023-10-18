import { PrismaClient } from "@prisma/client";
import { ManagedMock } from "../../services/sniffer/mock/mock.types";

export class MockModel {
  private readonly prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = new PrismaClient();
  }

  async findById(id: string) {
    return await this.prismaClient.mock.findFirst({ where: { id: id } });
  }

  async delete(id: string) {
    return await this.prismaClient.mock.delete({ where: { id: id } });
  }

  async update(mock: ManagedMock) {
    return await this.prismaClient.mock.update({
      where: { id: mock.id },
      data: mock,
    });
  }

  async create(userId: string, mock: ManagedMock) {
    await this.prismaClient.mock.create({ data: { user_id: userId, ...mock } });
  }

  async findAll(userId: string) {
    return await this.prismaClient.mock.findMany({
      where: { user_id: userId },
    });
  }
}
