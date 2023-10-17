import { PrismaClient } from "@prisma/client";
import { SnifferConfig } from "../sniffer/sniffer";
import { Request } from "express";
import { v4 } from "uuid";
import { RequestKey } from "../../services/intercepted-request";

export class RequestModel {
  private readonly prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = new PrismaClient();
  }

  upsertRequest(
    request: Request,
    service: SnifferConfig["id"],
    userId: string,
  ) {
    const { method, path } = request;
    const key = new RequestKey(method, path);

    this.prismaClient.request.upsert({
      where: {
        id: key.toString(),
      },
      create: {
        body: request.body,
        headers: JSON.stringify(request.headers),
        id: v4(),
        method,
        path,
      },
      update: {
        body: request.body,
        headers: JSON.stringify(request.headers),
        id: v4(),
        method,
        path,
      },
    });
  }
}
