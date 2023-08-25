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
  body: Record<string, string>;
  headers: Record<string, string>;
  params: Record<string, string>;
};

export type InterceptedRequest = {
  id: string;
  serviceId: string;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any; // The datatype can really accept all values
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

export type Collection = {
  id: string;
  name: string;
  requests: InterceptedRequest[];
};
