"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderValue = void 0;
const prompts_1 = require("@inquirer/prompts");
const select_1 = __importDefault(require("@inquirer/select"));
const logger_util_1 = require("./utils/logger.util");
const actions_1 = require("./actions/actions");
const { cyan, red, green } = require('kleur/colors');
//import {Answer} from '../models/choice';
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
(async () => {
    const answer = await (0, select_1.default)({
        message: green("Please select a command"),
        choices: listOfCommands
    });
    if (answer == ProviderValue.listRequests) {
        await (0, actions_1.getReqlistAction)();
    }
    else if (answer == ProviderValue.addRequest) {
        //  await addReqAction();
    }
    else if (answer == ProviderValue.execute) {
        //const request = new Request
        const act_snif_port = await (0, prompts_1.input)({
            message: "Please enter sniffer's port:",
            default: '5551'
        });
        const act_snif_port_num = +act_snif_port;
        //request.params = port;
        const act_server_port = await (0, prompts_1.input)({
            message: "Please enter server's port",
            default: "5012"
        });
        const act_server_port_num = +act_server_port;
        const act_method = await (0, prompts_1.input)({
            message: "Please enter request method",
            default: "GET"
        });
        const act_invocation = await (0, prompts_1.input)({
            message: "Please enter request invocation",
            default: ""
        });
        //request.body = {url,method, invocation};
        const input_config = {
            sniffer_port: act_snif_port_num,
            server_port: act_server_port_num,
            method: act_method,
            invocation: act_invocation
        };
        await (0, actions_1.executeAction)(input_config);
    }
})();
//const answer = await select({
/* 	message: "Please select a command",
    choices: listOfCommands
}); */
/* select({ choices: listOfCommands, message: "Please select a command" })
    //.then((question) =>  console.log(question))
    .then((question) => {
         if (question == ProviderValue.listRequests)
          {
            //console.log("h")
            console.log(Actions());
          }
          
      }); */
/* input({ message: green("Enter your name") })
  .then((res) => console.log(res))
  .then((res) => {
    select({ choices: listOfCommands, message: "hello" }).then((res) =>
      console.log("res2"),
    );
  });
 */ 
