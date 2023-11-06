export type EndpointType = {
  id: string;
  method: string;
  url: string;
};
export type InvocationType = {
  id: string;
  status: number;
  url: string;
  body: object;
  headers: object;
  method: string;
};
