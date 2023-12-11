import { NextFunction, Request, Response } from "express";
import { SnifferService } from "../../services/sniffer/sniffer.service";
import { MockService } from "../../services/mock/mock.service";

export default class MockMiddleware {
  constructor(
    private readonly mockService: MockService,
    private readonly snifferService: SnifferService
  ) {}

  async mock(req: Request, res: Response, next: NextFunction) {
    const subdomain = req.hostname.split(".")[0];
    const sniffer = await this.snifferService.findBySubdomain(subdomain);

    if (sniffer != null && sniffer.userId != null) {
      const mock = await this.mockService.getByUrl(
        sniffer?.userId,
        sniffer?.id,
        req.url,
        req.method
      );

      if (mock != null && mock.isActive === true) {
        Object.entries(mock.headers).forEach(([key, value]) => {
          res.setHeader(key, value);
        });

        res.status(mock.status).send(mock.body);
      } else {
        next();
      }
    } else {
      next();
    }
  }
}
