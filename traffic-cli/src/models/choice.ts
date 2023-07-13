export interface Answer {
    files: Object;
    provider: ProviderValue;
    userName: string;
}

export interface Choice {
    name: string;
    value: listRequests | 
           addRequest | 
           removeRequest | 
           execute |
		   ProviderValue;
}

export enum UniversalChoiceValue {
    ALL = 'ALL',
    LICENSE = 'LICENSE',
    CONTRIBUTING = 'CONTRIBUTING',
    CODE_OF_CONDUCT = 'CODE_OF_CONDUCT',
    TODO = 'TODO',
    README = 'README',
    CHANGELOG = 'CHANGELOG',
    DOCKERFILE = 'DOCKERFILE',
}

export enum listRequests {
	  FEATURE_REQUEST = 'FEATURE_REQUEST',
}

export enum addRequest {
    FEATURE_REQUEST = 'FEATURE_REQUEST',

}

export enum removeRequest {
    FEATURE_REQUEST = 'FEATURE_REQUEST',
}

export enum execute {
	FEATURE_REQUEST = 'FEATURE_REQUEST',
}


export enum ProviderValue {
    listRequests = 'listRequests',
    addRequest = 'addRequest',
    removeRequest = 'removeRequest',
    execute = 'execute',
}