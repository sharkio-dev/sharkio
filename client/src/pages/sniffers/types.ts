export type EndpointType = {
  id: string;
  method: string;
  url: string;
};
export type InvocationType = {
  id: string;
  snifferId: string;
  endpointId: string;
  response: {
    status: number;
    body: string;
    headers: object;
  };
  url: string;
  body: string;
  headers: {
    [key: string]: string;
  };
  method: string;
  createdAt: string;
};
