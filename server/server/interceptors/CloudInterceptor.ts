import { Request } from "express";
import EndpointService from "../../services/endpoint/endpoint.service";
import ResponseService from "../../services/response/response.service";
import { SnifferService } from "../../services/sniffer/sniffer.service";
import { Users } from "../../model/entities/Users";
import { Sniffer } from "../../model/entities/Sniffer";
import { Request as RequestModel } from "../../model/entities/Request";
import { Endpoint } from "../../model/entities/Endpoint";
import { MockService } from "../../services/mock/mock.service";
import { Mock } from "../../model/entities/Mock";
import { Interceptor } from "./Interceptor";

export class CloudInterceptor implements Interceptor {
  constructor(
    private readonly snifferService: SnifferService,
    private readonly endpointService: EndpointService,
    private readonly responseService: ResponseService,
    private readonly mockService: MockService,
  ) {}

  async findSnifferBySubdomain(subdomain: string): Promise<Sniffer | null> {
    return await this.snifferService.findBySubdomain(subdomain);
  }

  async setMockSelectedResponse(
    userId: string,
    mockId: string,
    selectedResponseId: string,
  ) {
    await this.mockService.setSelectedResponse(
      userId,
      mockId,
      selectedResponseId,
    );
  }

  async saveEndpoint(req: Request, sniffer: Sniffer) {
    return await this.endpointService.findOrCreate(
      req,
      sniffer.id,
      sniffer.userId,
    );
  }

  async saveRequest(request: Endpoint, testExecutionId?: string) {
    return await this.endpointService.addInvocation({
      ...request,
      testExecutionId,
    });
  }

  async saveResponse(
    res: { headers: any; statusCode: any; body: any },
    userId: Users["id"],
    snifferId: Sniffer["id"],
    invocationId: RequestModel["id"],
    testExecutionId?: string,
  ) {
    await this.responseService.addResponse({
      userId,
      snifferId,
      requestId: invocationId,
      headers: res.headers,
      body: res.body,
      status: res.statusCode,
      testExecutionId,
    });
  }

  async findMockByUrl(
    url: string,
    method: string,
    sniffer: Sniffer,
  ): Promise<Mock | null> {
    return await this.mockService.getByUrl(
      sniffer?.userId,
      sniffer?.id,
      url,
      method,
    );
  }
}
