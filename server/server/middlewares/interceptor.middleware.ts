import { NextFunction, Request, Response } from "express";
import { Request as RequestModel } from "../../model/entities/Request";
import { Sniffer } from "../../model/entities/Sniffer";
import { Users } from "../../model/entities/Users";
import { Interceptor } from "../interceptors/Interceptor";

export class RequestInterceptor {
  constructor(private readonly interceptor: Interceptor) {}

  async validateBeforeProxy(req: Request, res: Response, next: NextFunction) {
    const subdomain = req.hostname.split(".")[0];
    const sniffer = await this.interceptor.findSnifferBySubdomain(subdomain);

    if (sniffer === null) {
      res.sendStatus(404);
    } else {
      try {
        const interceptedInvocation = await this.interceptRequest(req, sniffer);

        if (interceptedInvocation?.id) {
          req.headers["x-sharkio-invocation-id"] = interceptedInvocation.id;
          req.headers["x-sharkio-sniffer-id"] = interceptedInvocation.snifferId;
          req.headers["x-sharkio-owner-id"] = interceptedInvocation.ownerId;
        }
        next();
      } catch (e) {
        res.sendStatus(500);
      }
    }
  }

  async interceptRequest(req: Request, sniffer: Sniffer) {
    const testExecutionId = req.headers["x-sharkio-test-execution-id"] as
      | string
      | undefined;
    req.headers["ngrok-skip-browser-warning"] = "true";

    const endpoint = await this.interceptor.saveEndpoint(req, sniffer);
    const { sniffer: _, ...rest } = endpoint;

    const invocation = await this.interceptor.saveRequest(
      {
        snifferId: endpoint.snifferId,
        endpointId: endpoint.id,
        ownerId: endpoint.ownerId,
        ...req,
        headers: req.headers,
      },
      testExecutionId,
    );

    return invocation;
  }

  async interceptResponse(
    ownerId: Users["id"],
    snifferId: Sniffer["id"],
    invocationId: RequestModel["id"],
    res: {
      headers: Record<string, string | string[] | undefined>;
      statusCode: number | undefined;
      body: any;
    },
    testExecutionId?: string,
  ) {
    return await this.interceptor.saveResponse(
      res,
      ownerId,
      snifferId,
      invocationId,
      testExecutionId,
    );
  }
}
