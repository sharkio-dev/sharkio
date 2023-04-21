export type PathData = {
  method: string;
  hitCount: number;
  invocations: Invocation[];
};

export type Invocation = {
  url: string;
  method: string;
  invocation: {
    body?: any;
    headers?: any;
    cookies?: any;
    params?: any;
  };
};
