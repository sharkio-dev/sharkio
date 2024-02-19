import { Request } from "express";
import { Endpoint } from "../../model/entities/Endpoint";
import { Mock } from "../../model/entities/Mock";
import { Request as RequestModel } from "../../model/entities/Request";
import { Sniffer } from "../../model/entities/Sniffer";

export interface Interceptor {
  findSnifferBySubdomain: (subdomain: string) => Promise<Sniffer | null>;
  findMockByUrl: (
    url: string,
    method: string,
    sniffer: Sniffer,
  ) => Promise<Mock | null>;
  setMockSelectedResponse: (
    ownerId: string,
    mockId: string,
    selectedResponseId: string,
  ) => Promise<void>;
  saveEndpoint: (req: Request, sniffer: Sniffer) => Promise<Endpoint>;
  saveRequest: (
    request: Partial<RequestModel>,
    testExecutionId?: string,
  ) => Promise<RequestModel>;
  saveResponse: (
    res: { headers: any; statusCode: any; body: any },
    ownerId: string,
    snifferId: Sniffer["id"],
    invocationId: RequestModel["id"],
    testExecutionId?: string,
  ) => Promise<void>;
}
