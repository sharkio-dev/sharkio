import { NextFunction, Request, Response } from "express";
import { MockService } from "./mock.service";
import { SnifferService } from "../sniffer/sniffer.service";
import { Z_SYNC_FLUSH } from "zlib";
export default class MockMiddleware {
  constructor(
    private readonly mockService: MockService,
    private readonly snifferService: SnifferService
  ) {}

  async mock(req: Request, res: Response, next: NextFunction) {
    const subdomain = req.hostname.split(".")[0];
    const sniffer = await this.snifferService.findBySubdomain(subdomain);

    if (sniffer != null && sniffer.userId != null) {
      const mock = await this.mockService.getMock(
        sniffer?.userId,
        sniffer?.id,
        `${req.method} ${req.url}`
      );

      if (mock !== undefined && mock.isActive === true) {
        res.status(mock.status).send(mock.body);
      } else {
        next();
      }
    } else {
      next();
    }
  }
}
