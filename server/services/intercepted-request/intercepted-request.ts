import axios from "axios";
import { Request } from "express";
import { v4 } from "uuid";
import { RequestKey } from "./request-key";
import { useLog } from "../../lib/log";
import {
  PathMetadataConfig,
  Invocation,
  SnifferConfig,
  PathResponseData,
} from "../../types";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

export class InterceptedRequest {
  static readonly defaultConfig: PathMetadataConfig = {
    bodyHistoryLimit: 10,
    recordBodies: true,
    recordHeaders: true,
    recordCookies: true,
    recordParams: true,
  };

  private id: string;
  private serviceId: string;
  private url: string;
  private method: string;
  private hitCount: number;
  private lastInvocationDate?: Date;
  private invocations: Invocation[];
  private config: PathMetadataConfig;

  constructor(key: RequestKey, serviceId: SnifferConfig["id"]) {
    this.id = v4();
    this.serviceId = serviceId;
    this.method = key.method;
    this.url = key.url;
    this.hitCount = 0;
    this.lastInvocationDate = undefined;
    this.invocations = [];
    this.config = InterceptedRequest.defaultConfig;
  }

  private logInvocation(request: Request) {
    if (this.invocations.length >= this.config.bodyHistoryLimit) {
      this.invocations.shift();
    }

    this.invocations.push({
      id: v4(),
      timestamp: new Date(),
      body: this.config.recordBodies === true ? request.body : undefined,
      headers: this.config.recordBodies === true ? request.headers : undefined,
      cookies: this.config.recordBodies === true ? request.cookies : undefined,
      params: this.config.recordParams === true ? request.params : undefined,
    });
  }

  intercept(request: Request) {
    this.hitCount++;
    this.lastInvocationDate = new Date();
    this.logInvocation(request);
  }

  async execute(invocation: Invocation) {
    log.info("executing request");
    return await axios({
      url: this.url,
      method: this.method,
      params: invocation.params,
      headers: invocation.headers,
      data: invocation.body,
    });
  }

  stats(): PathResponseData {
    const {
      id,
      url,
      serviceId,
      method,
      hitCount,
      lastInvocationDate,
      invocations,
    } = this;

    return {
      id,
      serviceId,
      url,
      method,
      hitCount,
      lastInvocationDate,
      invocations,
    };
  }
}
