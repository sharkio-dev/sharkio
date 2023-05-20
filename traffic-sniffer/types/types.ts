export type PathData = {
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

export type PathMetadataConfig = {
  body_history_limit: number;
  record_bodies: boolean;
  record_headers: boolean;
  record_cookies: boolean;
  record_params: boolean;
};

export type PathResponseData = {
  id: string;
  method: string;
  hitCount: number;
  lastInvocationDate: Date | undefined;
  url: string;
  invocations: Invocation[];
};
