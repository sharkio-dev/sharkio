import { PrismaClient } from "@prisma/client";
import { ManagedMock } from "../../services/sniffer/mock/mock.types";
import { BasePrismaClient } from "../../database/BasePrismaClient";
import { Mock } from "../../types";

export class MockModel extends BasePrismaClient<Mock> {
  // private readonly prismaClient: PrismaClient;

  constructor() {
    super("mock");
  }
}
