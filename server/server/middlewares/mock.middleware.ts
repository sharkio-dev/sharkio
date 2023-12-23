import { NextFunction, Request, Response } from "express";
import { SnifferService } from "../../services/sniffer/sniffer.service";
import { MockService } from "../../services/mock/mock.service";
import ResponseService from "../../services/response/response.service";
import { Mock } from "../../model/entities/Mock";

export default class MockMiddleware {
  constructor(
    private readonly mockService: MockService,
    private readonly snifferService: SnifferService,
    private readonly responseService: ResponseService
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
        Object.entries(mock.headers || {}).forEach(([key, value]) => {
          res.setHeader(key, value);
        });

        await this.interceptResponse(req, mock);

        res.status(mock.status).send(mock.body);
      } else {
        next();
      }
    } else {
      next();
    }
  }

  async interceptResponse(req: Request, mock: Mock) {
    const invocationId = req.headers["x-sharkio-invocation-id"];
    const snifferId = req.headers["x-sharkio-sniffer-id"] as string;
    const userId = req.headers["x-sharkio-user-id"] as string;
    const testExecutionId = req.headers[
      "x-sharkio-test-execution-id"
    ] as string;

    if (invocationId != null && typeof invocationId === "string") {
      return await this.responseService.addResponse({
        userId,
        snifferId,
        requestId: invocationId,
        headers: mock.headers,
        body: mock.body,
        status: mock.status,
        testExecutionId,
      });
    }
  }
}
