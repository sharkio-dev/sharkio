import axios from "axios";
import { Request } from "express";
import { v4 } from "uuid";
import {
  Invocation,
  PathMetadataConfig,
  PathResponseData,
} from "../../types/types";

export class PathMetadata {
  static defaultConfig: PathMetadataConfig = {
    bodyHistoryLimit: 10,
    recordBodies: true,
    recordHeaders: true,
    recordCookies: true,
    recordParams: true,
  }

  private id: string;
  private service: string;
  private url: string;
  private method: string;
  private hitCount: number;
  private lastInvocationDate?: Date;
  private invocations: Invocation[];
  private config: PathMetadataConfig;

  constructor(method: string, url: string, service: string) {
    this.id = v4();
    this.service = service;
    this.url = url;
    this.method = method;
    this.hitCount = 0;
    this.lastInvocationDate = undefined;
    this.invocations = [];
    this.config = PathMetadata.defaultConfig;
  }

  interceptRequest(request: Request) {
    this.hitCount++;
    this.lastInvocationDate = new Date();

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

  async execute(invocation: Invocation) {
    return await axios({
      url: this.url,
      method: this.method,
      params: invocation.params,
      headers: invocation.headers,
      data: invocation.body,
    });
  }

  stats(): PathResponseData {
    const { id, url, service, method, hitCount, lastInvocationDate, invocations  } = this;
    
    return {
      id,
      service,
      url,
      method,
      hitCount,
      lastInvocationDate,
      invocations,
    };
  }
}
