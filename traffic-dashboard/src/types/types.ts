export type SnifferConfig = {
  port: number;
  downstreamUrl: string;
  isStarted: boolean;
  name: string;
  id: string;
};

export type SnifferCreateConfig = {
  port: number;
  downstreamUrl: string;
  name: string;
  id: string;
};

export type Invocation = {
  id: string;
  timestamp: string;
  body: unknown;
  headers: unknown;
  params: unknown;
};

export type InterceptedRequest = {
  id: string;
  service: string;
  url: string;
  method: string;
  hitCount: number;
  lastInvocationDate: string;
  invocations: Invocation[];
};

export type Sniffer = {
  id: string;
  config: SnifferConfig;
  isStarted: boolean;
  mocks: Mock[];
  interceptedRequests: InterceptedRequest[];
};

export type Mock = {
  method: string;
  endpoint: string;
  data: any;
  active: boolean;
  id: string;
  status: number;
};

export type Service = {
  name: string;
  port: number;
};

export type ServiceMock = {
  service: Service;
  mocks: Mock[];
};
