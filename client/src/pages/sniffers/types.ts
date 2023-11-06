export type EndpointType = {
  id: string;
  method: string;
  url: string;
};
export type InvocationType = {
  id: string;
  response: {
    status: number;
    body: object;
    headers: object;
  };
  url: string;
  body: object;
  headers: object;
  method: string;
};
