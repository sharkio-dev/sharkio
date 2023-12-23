import { NextFunction, Request, Response } from "express";
import { useLog } from "../../lib/log/index";
import EndpointService from "../../services/endpoint/endpoint.service";
import ResponseService from "../../services/response/response.service";
import { SnifferService } from "../../services/sniffer/sniffer.service";
import { Users } from "../../model/entities/Users";
import { Sniffer } from "../../model/entities/Sniffer";
import { Request as RequestModel } from "../../model/entities/Request";

const logger = useLog({
  dirname: __dirname,
  filename: __filename,
});

export class RequestInterceptor {
  constructor(
    private readonly snifferService: SnifferService,
    private readonly endpointService: EndpointService,
    private readonly responseService: ResponseService
  ) {}

  async validateBeforeProxy(req: Request, res: Response, next: NextFunction) {
    const subdomain = req.hostname.split(".")[0];
    const sniffer = await this.snifferService.findBySubdomain(subdomain);

    if (sniffer === null) {
      res.sendStatus(404);
    } else {
      const interceptedInvocation = await this.interceptRequest(req);

      if (interceptedInvocation?.id) {
        req.headers["x-sharkio-invocation-id"] = interceptedInvocation.id;
        req.headers["x-sharkio-sniffer-id"] = interceptedInvocation.snifferId;
        req.headers["x-sharkio-user-id"] = interceptedInvocation.userId;
      }

      next();
    }
  }

  async interceptRequest(req: Request) {
    const subdomain = req.hostname.split(".")[0];
    const sniffer = await this.snifferService.findBySubdomain(subdomain);

    if (sniffer === null) {
      return undefined;
    }

    const testExecutionId = req.headers["x-sharkio-test-execution-id"] as
      | string
      | undefined;
    // delete req.headers["host"];
    // req.headers["host"] = `${subdomain}.${process.env.PROXY_SERVER_DOMAIN}`;
    req.headers["ngrok-skip-browser-warning"] = "true";

    const request = await this.endpointService.findOrCreate(
      req,
      sniffer.id,
      sniffer.userId
    );

    const invocation = await this.endpointService.addInvocation({
      ...request,
      testExecutionId,
    });

    return invocation;
  }

  async interceptResponse(
    userId: Users["id"],
    snifferId: Sniffer["id"],
    invocationId: RequestModel["id"],
    res: {
      headers: Record<string, string | string[] | undefined>;
      statusCode: number | undefined;
      body: any;
    },
    testExecutionId?: string
  ) {
    return await this.responseService.addResponse({
      userId,
      snifferId,
      requestId: invocationId,
      headers: res.headers,
      body: res.body,
      status: res.statusCode,
      testExecutionId,
    });
  }
}
