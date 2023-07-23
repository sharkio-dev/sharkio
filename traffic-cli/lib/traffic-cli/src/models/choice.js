"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderValue = exports.execute = exports.removeRequest = exports.addRequest = exports.listRequests = exports.UniversalChoiceValue = void 0;
var UniversalChoiceValue;
(function (UniversalChoiceValue) {
    UniversalChoiceValue["ALL"] = "ALL";
    UniversalChoiceValue["LICENSE"] = "LICENSE";
    UniversalChoiceValue["CONTRIBUTING"] = "CONTRIBUTING";
    UniversalChoiceValue["CODE_OF_CONDUCT"] = "CODE_OF_CONDUCT";
    UniversalChoiceValue["TODO"] = "TODO";
    UniversalChoiceValue["README"] = "README";
    UniversalChoiceValue["CHANGELOG"] = "CHANGELOG";
    UniversalChoiceValue["DOCKERFILE"] = "DOCKERFILE";
})(UniversalChoiceValue || (exports.UniversalChoiceValue = UniversalChoiceValue = {}));
var listRequests;
(function (listRequests) {
    listRequests["FEATURE_REQUEST"] = "FEATURE_REQUEST";
})(listRequests || (exports.listRequests = listRequests = {}));
var addRequest;
(function (addRequest) {
    addRequest["FEATURE_REQUEST"] = "FEATURE_REQUEST";
})(addRequest || (exports.addRequest = addRequest = {}));
var removeRequest;
(function (removeRequest) {
    removeRequest["FEATURE_REQUEST"] = "FEATURE_REQUEST";
})(removeRequest || (exports.removeRequest = removeRequest = {}));
var execute;
(function (execute) {
    execute["FEATURE_REQUEST"] = "FEATURE_REQUEST";
})(execute || (exports.execute = execute = {}));
var ProviderValue;
(function (ProviderValue) {
    ProviderValue["listRequests"] = "listRequests";
    ProviderValue["addRequest"] = "addRequest";
    ProviderValue["removeRequest"] = "removeRequest";
    ProviderValue["execute"] = "execute";
})(ProviderValue || (exports.ProviderValue = ProviderValue = {}));
