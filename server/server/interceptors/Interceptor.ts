import { Request } from "express";
import { Users } from "../../model/entities/Users";
import { Sniffer } from "../../model/entities/Sniffer";
import { Request as RequestModel } from "../../model/entities/Request";
import { Endpoint } from "../../model/entities/Endpoint";
import { Mock } from "../../model/entities/Mock";

export interface Interceptor {
  findSnifferBySubdomain: (subdomain: string) => Promise<Sniffer | null>;
  findMockByUrl: (
    url: string,
    method: string,
    sniffer: Sniffer
  ) => Promise<Mock | null>;
  setMockSelectedResponse: (
    userId: string,
    mockId: string,
    selectedResponseId: string
  ) => Promise<void>;
  saveEndpoint: (req: Request, sniffer: Sniffer) => Promise<Endpoint>;
  saveRequest: (
    request: Endpoint,
    testExecutionId?: string
  ) => Promise<RequestModel>;
  saveResponse: (
    res: { headers: any; statusCode: any; body: any },
    userId: Users["id"],
    snifferId: Sniffer["id"],
    invocationId: RequestModel["id"],
    testExecutionId?: string
  ) => Promise<void>;
}
