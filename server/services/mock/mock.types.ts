export type Mock = {
  method: string;
  endpoint: string;
  data: any;
  status: number;
};

export type ManagedMock = Mock & {
  id: string;
  active: boolean;
};
