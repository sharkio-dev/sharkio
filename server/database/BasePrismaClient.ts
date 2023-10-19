// import all interfaces
import { IWrite } from "./interfaces/IWrite";
import { IRead } from "./interfaces/IRead";

import { PrismaClient } from "@prisma/client";

const prismaClient: PrismaClient = new PrismaClient();

// that class only can be extended
export abstract class BasePrismaClient<T> implements IWrite<T>, IRead<T> {
  //creating a property to use your code in all instances
  // that extends your base repository and reuse on methods of class
  // private readonly prismaClient: PrismaClient;
  protected readonly tableName: string;

  //we created constructor with arguments to manipulate mongodb operations
  constructor(tableName: string) {
    // prismaClient = new PrismaClient();
    this.tableName = tableName;
  }

  // we add to method, the async keyword to manipulate the insertOne result
  // of method.
  async create(userId: string, item: T): Promise<T> {
    await prismaClient[this.tableName].create({
      data: { user_id: userId, ...item },
    });

    // after the insert operations, we returns only acknowledged property (that haves a 1 or 0 results)
    // and we convert to boolean result (0 false, 1 true)
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
