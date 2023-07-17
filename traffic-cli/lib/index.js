"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderValue = void 0;
const prompts_1 = require("@inquirer/prompts");
const logger_util_1 = require("./utils/logger.util");
const actions_1 = require("./actions");
var ProviderValue;
(function (ProviderValue) {
    ProviderValue["listRequests"] = "listRequests";
    ProviderValue["addRequest"] = "addRequest";
    ProviderValue["removeRequest"] = "removeRequest";
    ProviderValue["execute"] = "execute";
})(ProviderValue || (exports.ProviderValue = ProviderValue = {}));
const listOfCommands = [
    { name: "listRequests", value: ProviderValue.listRequests },
    { name: "addRequest", value: ProviderValue.addRequest },
    { name: "removeRequest", value: ProviderValue.removeRequest },
    { name: "execute", value: ProviderValue.execute },
];
//const providerAnswer: Answer = await providerQuestion();
(0, logger_util_1.showTitleAndBanner)();
(0, prompts_1.select)({ choices: listOfCommands, message: "Please select a command" }).then((question) => console.log(question))
    .then((question) => {
    if (question == ProviderValue.listRequests) {
        return await (0, actions_1.listReqAction)();
    }
});
/* input({ message: green("Enter your name") })
  .then((res) => console.log(res))
  .then((res) => {
    select({ choices: listOfCommands, message: "hello" }).then((res) =>
      console.log("res2"),
    );
  });
 */ 
