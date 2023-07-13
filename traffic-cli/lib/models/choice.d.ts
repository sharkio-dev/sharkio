export interface Answer {
    files: Object;
    provider: ProviderValue;
    userName: string;
}
export interface Choice {
    name: string;
    value: listRequests | addRequest | removeRequest | execute | ProviderValue;
}
export declare enum UniversalChoiceValue {
    ALL = "ALL",
    LICENSE = "LICENSE",
    CONTRIBUTING = "CONTRIBUTING",
    CODE_OF_CONDUCT = "CODE_OF_CONDUCT",
    TODO = "TODO",
    README = "README",
    CHANGELOG = "CHANGELOG",
    DOCKERFILE = "DOCKERFILE"
}
export declare enum listRequests {
    FEATURE_REQUEST = "FEATURE_REQUEST"
}
export declare enum addRequest {
    FEATURE_REQUEST = "FEATURE_REQUEST"
}
export declare enum removeRequest {
    FEATURE_REQUEST = "FEATURE_REQUEST"
}
export declare enum execute {
    FEATURE_REQUEST = "FEATURE_REQUEST"
}
export declare enum ProviderValue {
    listRequests = "listRequests",
    addRequest = "addRequest",
    removeRequest = "removeRequest",
    execute = "execute"
}
//# sourceMappingURL=choice.d.ts.map