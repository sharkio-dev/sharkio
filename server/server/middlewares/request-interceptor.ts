import { NextFunction, Request, Response } from "express";
import { useLog } from "../../lib/log/index";
import RequestService from "../../services/request/request.service";
import ResponseService from "../../services/response/response.service";
import { SnifferService } from "../../services/sniffer/sniffer.service";
import { User } from "../../model/user/user.model";
import { Sniffer } from "../../model/sniffer/sniffers.model";
import { Invocation } from "../../model/invocation/invocation.model";

const logger = useLog({
  dirname: __dirname,
  filename: __filename,
});

export class RequestInterceptor {
  constructor(
    private readonly snifferService: SnifferService,
    private readonly requestService: RequestService,
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

    const request = await this.requestService.findOrCreate(
      req,
      sniffer.id,
      sniffer.userId
    );
    const invocation = await this.requestService.addInvocation(request);

    return invocation;
  }

  async interceptResponse(
    userId: User["id"],
    snifferId: Sniffer["id"],
    invocationId: Invocation["id"],
    res: {
      headers: Record<string, string | string[] | undefined>;
      statusCode: number | undefined;
      body: any;
    }
  ) {
    await this.responseService.addResponse({
      userId,
      snifferId,
      invocationId,
      headers: res.headers,
      body: res.body,
      status: res.statusCode,
    });
  }
}
