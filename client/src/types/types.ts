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
  method: string;
  body: Record<string, string>;
  headers: Record<string, string>;
  params: Record<string, string>;
};

export type InterceptedRequest = {
  id: string;
  snifferId: string;
  url: string;
  method: string;
  invocations: Invocation[];
};

export type Collection = {
  id: string;
  name: string;
  requests: InterceptedRequest[];
};
