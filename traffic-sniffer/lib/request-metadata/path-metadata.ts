import { Request } from "express";
import { v4 } from "uuid";
import axios from "axios";

type PathData = {
  method: string;
  hitCount: number;
  lastInvocationDate?: Date;
  invocations: Invocation[];
};

export type Invocation = {
  id: string;
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
  private id: string;
  private url: string;
  private data: PathData;
  private config: PathMetadataConfig;

  constructor(method: string, url: string) {
    this.id = v4();
    this.url = url;
    this.data = {
      method,
      hitCount: 0,
      lastInvocationDate: undefined,
      invocations: [],
    };
    this.config = {
      body_history_limit: 10,
      record_bodies: true,
      record_headers: true,
      record_cookies: true,
      record_params: true,
    };
  }

  interceptRequest(request: Request) {
    this.incHitCount();
    this.data.lastInvocationDate = new Date();

    if (this.data.invocations.length >= this.config.body_history_limit) {
      this.data.invocations.shift();
    }

    this.data.invocations.push({
      id: v4(),
      timestamp: new Date(),
      body: this.config.record_bodies === true ? request.body : undefined,
      headers: this.config.record_bodies === true ? request.headers : undefined,
      cookies: this.config.record_bodies === true ? request.cookies : undefined,
      params: this.config.record_params === true ? request.params : undefined,
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

  getData() {
    const { id, url } = this;
    const { method, hitCount, lastInvocationDate, invocations } = this.data;

    return {
      id,
      url,
      method,
      hitCount,
      lastInvocationDate,
      invocations,
    };
  }

  printMetadata() {
    const { method, hitCount, invocations } = this.data;
    console.log(JSON.stringify({ method, hitCount, invocations }, null, 2));
  }
}
