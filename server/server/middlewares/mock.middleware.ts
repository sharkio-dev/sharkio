import { NextFunction, Request, Response } from "express";
import { MockResponse } from "../../model/entities/MockResponse";
import { MockResponseSelector } from "../../services/mock-response-selector/mock-response-selector";
import { MockService } from "../../services/mock/mock.service";
import ResponseService from "../../services/response/response.service";
import { SnifferService } from "../../services/sniffer/sniffer.service";
import { Mock } from "../../model/entities/Mock";

export default class MockMiddleware {
  constructor(
    private readonly mockService: MockService,
    private readonly snifferService: SnifferService,
    private readonly responseService: ResponseService,
    private readonly mockResponseSelector: MockResponseSelector,
  ) {}

  async mock(req: Request, res: Response, next: NextFunction) {
    const subdomain = req.hostname.split(".")[0];
    const sniffer = await this.snifferService.findBySubdomain(subdomain);

    if (sniffer != null && sniffer.userId != null) {
      const mock: Mock | null = await this.mockService.getByUrl(
        sniffer?.userId,
        sniffer?.id,
        req.url,
        req.method,
      );

      if (mock != null && mock.isActive === true) {
        const selectedResponse = await this.mockResponseSelector.select(mock);
        if (selectedResponse != null) {
          Object.entries(selectedResponse.headers || {}).forEach(
            ([key, value]) => {
              res.setHeader(key, value);
            },
          );

          await this.interceptMockResponse(req, selectedResponse);
          await this.updateSelectedResponse(
            sniffer.userId,
            mock,
            selectedResponse.id,
          );

          res.status(selectedResponse.status).send(selectedResponse.body);
        }
      } else {
        next();
      }
    } else {
      next();
    }
  }

  async interceptMockResponse(req: Request, mock: MockResponse | Mock) {
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
        headers: mock.headers ?? {},
        body: mock.body ?? "",
        status: mock.status,
        testExecutionId,
      });
    }
  }

  updateSelectedResponse(
    userId: string,
    mock: Mock,
    selectedResponseId: string,
  ) {
    return this.mockService.setSelectedResponse(
      userId,
      mock.id,
      selectedResponseId,
    );
  }
}
