export type Mock = {
    method: string;
    endpoint: string;
    data: any;
}

export type ManagedMock = Mock & {
    id: string;
    active: boolean;
}
