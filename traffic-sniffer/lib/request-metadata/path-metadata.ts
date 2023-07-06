import axios from "axios";
import { Request } from "express";
import { v4 } from "uuid";
import {
  Invocation,
  PathData,
  PathMetadataConfig,
  PathResponseData,
} from "../../types/types";

export class PathMetadata {
  private id: string;
  private service: string;
  private url: string;
  private data: PathData;
  private config: PathMetadataConfig;

  constructor(method: string, url: string, service: string) {
    this.id = v4();
    this.service = service;
    this.url = url;
    this.data = {
      method,
      hitCount: 0,
      lastInvocationDate: undefined,
      invocations: [],
    };
    this.config = {
      name: this.id,
      bodyHistoryLimit: 10,
      recordBodies: true,
      recordHeaders: true,
      recordCookies: true,
      recordParams: true,
    };
  }

  interceptRequest(request: Request) {
    this.incHitCount();
    this.data.lastInvocationDate = new Date();

    if (this.data.invocations.length >= this.config.bodyHistoryLimit) {
      this.data.invocations.shift();
    }

    this.data.invocations.push({
      id: v4(),
      timestamp: new Date(),
      body: this.config.recordBodies === true ? request.body : undefined,
      headers: this.config.recordBodies === true ? request.headers : undefined,
      cookies: this.config.recordBodies === true ? request.cookies : undefined,
      params: this.config.recordParams === true ? request.params : undefined,
    });
  }

  async execute(invocation: Invocation) {
    return await axios({
      url: this.url,
      method: this.data.method,
      params: invocation.params,
      headers: invocation.headers,
      data: invocation.body,
    });
  }

  private incHitCount() {
    this.data.hitCount = this.data.hitCount + 1;
  }

  getData(): PathResponseData {
    const { id, url, service } = this;
    const { method, hitCount, lastInvocationDate, invocations } = this.data;

    const res: PathResponseData = {
      id,
      service,
      url,
      method,
      hitCount,
      lastInvocationDate,
      invocations,
    };

    return res;
  }

  printMetadata() {
    const { method, hitCount, invocations } = this.data;
    console.log(JSON.stringify({ method, hitCount, invocations }, null, 2));
  }
}
