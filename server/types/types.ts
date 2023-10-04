export type SnifferConfig = {
  name: string;
  port: number;
  downstreamUrl: string;
  id: string;
};

export type Invocation = {
  id: string;
  timestamp: Date;
  body?: any;
  headers?: any;
  cookies?: any;
  params?: any;
};

export type PathMetadataConfig = {
  bodyHistoryLimit: number;
  recordBodies: boolean;
  recordHeaders: boolean;
  recordCookies: boolean;
  recordParams: boolean;
};

export type PathResponseData = {
  id: string;
  serviceId: SnifferConfig["id"];
  method: string;
  hitCount: number;
  lastInvocationDate: Date | undefined;
  url: string;
  invocations: Invocation[];
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
