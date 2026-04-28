import { DeepPartial } from "typeorm";
import { useLog } from "../../lib/log";
import { Request } from "../../model/entities/Request";
import { Response } from "../../model/entities/Response";
import { RequestRepository } from "../../model/repositories/request.repository";
import { ResponseRepository } from "../../model/repositories/response.repository";

const logger = useLog({ dirname: __dirname, filename: __filename });

export interface WriteBufferOptions {
  intervalMs: number;
  maxBatch: number;
  maxBuffer: number;
}

const DEFAULT_OPTIONS: WriteBufferOptions = {
  intervalMs: 200,
  maxBatch: 200,
  maxBuffer: 5000,
};

export class WriteBuffer {
  private requests: DeepPartial<Request>[] = [];
  private responses: DeepPartial<Response>[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private flushing = false;
  private droppedRequests = 0;
  private droppedResponses = 0;
  private readonly opts: WriteBufferOptions;

  constructor(
    private readonly requestRepository: RequestRepository,
    private readonly responseRepository: ResponseRepository,
    opts: Partial<WriteBufferOptions> = {},
  ) {
    this.opts = { ...DEFAULT_OPTIONS, ...opts };
  }

  enqueueRequest(req: DeepPartial<Request>) {
    if (this.requests.length >= this.opts.maxBuffer) {
      this.droppedRequests++;
      if (this.droppedRequests % 100 === 1) {
        logger.warn("write buffer full, dropping request", {
          dropped: this.droppedRequests,
          buffered: this.requests.length,
        });
      }
      return;
    }
    this.requests.push(req);
    this.scheduleFlush();
  }

  enqueueResponse(res: DeepPartial<Response>) {
    if (this.responses.length >= this.opts.maxBuffer) {
      this.droppedResponses++;
      if (this.droppedResponses % 100 === 1) {
        logger.warn("write buffer full, dropping response", {
          dropped: this.droppedResponses,
          buffered: this.responses.length,
        });
      }
      return;
    }
    this.responses.push(res);
    this.scheduleFlush();
  }

  private scheduleFlush() {
    if (this.flushTimer != null || this.flushing) return;
    this.flushTimer = setTimeout(() => {
      this.flushTimer = null;
      this.flush().catch((e) => logger.error("flush loop failed", { e }));
    }, this.opts.intervalMs);
  }

  async flush() {
    if (this.flushing) return;
    this.flushing = true;
    try {
      // Requests must flush before responses to satisfy FK on response.request_id.
      while (this.requests.length > 0) {
        const batch = this.requests.splice(0, this.opts.maxBatch);
        try {
          await this.requestRepository.repository.insert(batch);
        } catch (e) {
          logger.error("request batch insert failed", {
            e,
            count: batch.length,
          });
        }
      }
      while (this.responses.length > 0) {
        const batch = this.responses.splice(0, this.opts.maxBatch);
        try {
          await this.responseRepository.repository.insert(batch);
        } catch (e) {
          logger.error("response batch insert failed", {
            e,
            count: batch.length,
          });
        }
      }
    } finally {
      this.flushing = false;
      if (this.requests.length > 0 || this.responses.length > 0) {
        this.scheduleFlush();
      }
    }
  }

  async shutdown() {
    if (this.flushTimer != null) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    await this.flush();
  }
}
