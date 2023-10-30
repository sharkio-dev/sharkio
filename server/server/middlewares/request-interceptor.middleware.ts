import { NextFunction, Request, Response } from "express";
import { useLog } from "../../lib/log/index";
import { SnifferService } from "../../services/sniffer/sniffer.service";
import RequestService from "../../services/request/request.service";

const logger = useLog({
  dirname: __dirname,
  filename: __filename,
});

export class RequestInterceptorMiddleware {
  constructor(
    private readonly snifferService: SnifferService,
    private readonly requestService: RequestService,
  ) {}

  async intercept(req: Request, res: Response, next: NextFunction) {
    // TODO make more robust subdomain detection
    const subdomain = req.hostname.split(".")[0];
    // TODO separate in the future in order to not slow down network requests
    const sniffer = await this.snifferService.findBySubdomain(subdomain);

    if (sniffer === null) {
      return res.sendStatus(404);
    }

    const request = await this.requestService.findOrCreate(
      req,
      sniffer.id,
      sniffer.userId,
    );
    await this.requestService.addInvocation(request);

    next();
  }
}
