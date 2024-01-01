import { NextFunction, Request, Response } from "express";
import { MockResponse } from "../../model/entities/MockResponse";
import { MockResponseSelector } from "../../services/mock-response-selector/mock-response-selector";
import { MockService } from "../../services/mock/mock.service";
import ResponseService from "../../services/response/response.service";
import { SnifferService } from "../../services/sniffer/sniffer.service";
import { Mock } from "../../model/entities/Mock";
import { useLog } from "../../lib/log";
import { MockResponseTransformer } from "../../services/mock-response-transformer/mock-response-transformer";

const logger = useLog({
  dirname: __dirname,
  filename: __filename,
});

export default class MockMiddleware {
  constructor(
    private readonly mockService: MockService,
    private readonly snifferService: SnifferService,
    private readonly responseService: ResponseService,
    private readonly mockResponseSelector: MockResponseSelector,
    private readonly mockResponseTransformer: MockResponseTransformer,
  ) {}

  async findMock(hostname: string, url: string, method: string) {
    const subdomain = hostname.split(".")[0];
    const sniffer = await this.snifferService.findBySubdomain(subdomain);

    if (sniffer != null && sniffer.userId != null) {
      const urlNoParams = url.split("?")[0];

      const mock: Mock | null = await this.mockService.getByUrl(
        sniffer?.userId,
        sniffer?.id,
        urlNoParams,
        method,
      );

      if (mock != null && mock.isActive === true) {
        return mock;
      }
    }
  }

  async mock(req: Request, res: Response, next: NextFunction) {
    const mock = await this.findMock(req.hostname, req.url, req.method);
    const selectedResponse = mock
      ? await this.mockResponseSelector.select(mock)
      : null;

    if (mock != null && selectedResponse != null) {
      const transformedResponse = this.mockResponseTransformer.transform(
        selectedResponse,
        {
          body: req.body,
          headers: req.headers,
          method: req.method,
          url: req.url,
          params: req.params,
          query: req.query,
        },
      );

      Object.entries(transformedResponse.headers || {}).forEach(
        ([key, value]) => {
          res.setHeader(key, value);
        },
      );

      res.status(transformedResponse.status).send(transformedResponse.body);

      try {
        await this.interceptMockResponse(req, transformedResponse);
        await this.updateSelectedResponse(
          selectedResponse.userId,
          mock,
          selectedResponse.id,
        );
      } catch (e) {
        logger.error("Failed to intercept mock response", e);
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
