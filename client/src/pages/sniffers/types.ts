export type EndpointType = {
  id: string;
  method: string;
  url: string;
};
export type InvocationType = {
  id: string;
  response: {
    status: number;
    body: object | string;
    headers: object;
  };
  url: string;
  body: object | string;
  headers: {
    [key: string]: string;
  };
  method: string;
  createdAt: string;
};
