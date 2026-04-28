import { randomUUID } from "crypto";
import { Request } from "express";
import { Mock } from "../../model/entities/Mock";
import { Request as RequestModel } from "../../model/entities/Request";
import { Sniffer } from "../../model/entities/Sniffer";
import EndpointService from "../../services/endpoint/endpoint.service";
import { MockService } from "../../services/mock/mock.service";
import { SnifferService } from "../../services/sniffer/sniffer.service";
import { WriteBuffer } from "../../services/write-buffer/write-buffer";
import { Interceptor } from "./Interceptor";

export class CloudInterceptor implements Interceptor {
  constructor(
    private readonly snifferService: SnifferService,
    private readonly endpointService: EndpointService,
    private readonly mockService: MockService,
    private readonly writeBuffer: WriteBuffer,
  ) {}

  async findSnifferBySubdomain(subdomain: string): Promise<Sniffer | null> {
    return await this.snifferService.findBySubdomain(subdomain);
  }

  async setMockSelectedResponse(
    ownerId: string,
    mockId: string,
    selectedResponseId: string,
  ) {
    await this.mockService.setSelectedResponse(
      ownerId,
      mockId,
      selectedResponseId,
    );
  }

  async saveEndpoint(req: Request, sniffer: Sniffer) {
    return this.endpointService.findOrCreate(req, sniffer.id, sniffer.ownerId);
  }

  async saveRequest(request: Partial<RequestModel>, testExecutionId?: string) {
    const id = randomUUID();
    const now = new Date();
    const row = {
      id,
      endpointId: request.endpointId,
      snifferId: request.snifferId,
      ownerId: request.ownerId,
      method: request.method,
      body: request.body,
      headers: request.headers,
      url: request.url,
      testExecutionId: request.testExecutionId ?? testExecutionId ?? null,
      createdAt: now,
      updatedAt: now,
    };
    this.writeBuffer.enqueueRequest(row);
    return row as RequestModel;
  }

  async saveResponse(
    res: { headers: any; statusCode: any; body: any },
    ownerId: string,
    snifferId: Sniffer["id"],
    invocationId: RequestModel["id"],
    testExecutionId?: string,
  ) {
    const now = new Date();
    this.writeBuffer.enqueueResponse({
      id: randomUUID(),
      ownerId,
      snifferId,
      requestId: invocationId,
      headers: res.headers,
      body: res.body,
      status: res.statusCode,
      testExecutionId: testExecutionId ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }

  async findMockByUrl(
    url: string,
    method: string,
    sniffer: Sniffer,
  ): Promise<Mock | null> {
    return await this.mockService.getByUrl(
      sniffer?.ownerId,
      sniffer?.id,
      url,
      method,
    );
  }
}
