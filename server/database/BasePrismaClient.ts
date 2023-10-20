import { IWrite } from "./interfaces/IWrite";
import { IRead } from "./interfaces/IRead";

import { PrismaClient } from "@prisma/client";

const prismaClient: PrismaClient = new PrismaClient();

// that class only can be extended
export abstract class BasePrismaClient<T> implements IWrite<T>, IRead<T> {
  protected readonly tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async create(userId: string, item: T): Promise<T> {
    await prismaClient[this.tableName].create({
      data: { user_id: userId, ...item },
    });
  }

  async update(id: string, item: T): Promise<boolean> {
    return await prismaClient[this.tableName].update({
      where: { id: item.id },
      data: item,
    });
  }

  async delete(id: string): Promise<boolean> {
    return await prismaClient[this.tableName].delete({ where: { id: id } });
  }

  async findAll(userId: string): Promise<T[]> {
    return await prismaClient[this.tableName].findMany({
      where: { user_id: userId },
    });
  }

  async findByQuery(query: object): Promise<T[]> {
    return await prismaClient[this.tableName].findMany({
      where: query,
    });
  }

  async findById(id: string): Promise<T> {
    return await prismaClient[this.tableName].findFirst({ where: { id: id } });
  }
}
