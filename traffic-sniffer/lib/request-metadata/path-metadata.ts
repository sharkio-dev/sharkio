import { Request } from "express";

type Invocation = {
  timestamp: Date;
  body?: any;
  headers?: any;
  cookies?: any;
  params?: any;
};

type PathMetadataConfig = {
  body_history_limit: number;
  record_bodies: boolean;
  record_headers: boolean;
  record_cookies: boolean;
  record_params: boolean;
};

export class PathMetadata {
  private hitCount: number;
  private invocations: Invocation[];
  private config: PathMetadataConfig;

  constructor(private readonly method: string, private readonly path: string) {
    this.hitCount = 0;
    this.invocations = [];
    this.config = {
      body_history_limit: 10,
      record_bodies: true,
      record_headers: true,
      record_cookies: true,
      record_params: true,
    };
  }

  extractMetadata(request: Request) {
    this.incHitCount();

    if (this.invocations.length >= this.config.body_history_limit) {
      this.invocations.shift();
    }

    this.invocations.push({
      timestamp: new Date(),
      body: this.config.record_bodies === true ? request.body : undefined,
      headers: this.config.record_bodies === true ? request.headers : undefined,
      cookies: this.config.record_bodies === true ? request.cookies : undefined,
      params: this.config.record_params === true ? request.params : undefined,
    });
  }

  private incHitCount() {
    this.hitCount = this.hitCount + 1;
  }

  printMetadata() {
    const { method, path, hitCount, invocations } = this;
    console.log(
      JSON.stringify({ method, path, hitCount, invocations }, null, 2)
    );
  }
}
