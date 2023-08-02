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
        const act_url = await (0, prompts_1.input)({
            message: "Please enter url",
            default: "http://localhost:5012"
        });
        const act_method = await (0, prompts_1.input)({
            message: "Please enter request method",
            default: "GET"
        });
        const act_sniffer_mame = await (0, prompts_1.input)({
            message: "Please enter sniffer name",
            default: "cli_snif"
        });
        const body = await (0, prompts_1.input)({
            message: "Please enter request body:",
            default: ""
        });
        const headers = await (0, prompts_1.input)({
            message: "Please enter request headers:",
            default: ""
        });
        const cookies = await (0, prompts_1.input)({
            message: "Please enter request cookies:",
            default: ""
        });
        const params = await (0, prompts_1.input)({
            message: "Please enter request params:",
            default: ""
        });
        const timestamp = new Date();
        const act_invocation = { "id": act_sniffer_mame, "timestamp": timestamp, "body": body, "headers": headers, "cookies": cookies, "params": params
        };
        const input_config = {
            url: act_url,
            sniffer_mame: act_sniffer_mame,
            //server_port: act_server_port_num,
            method: act_method,
            invocation: act_invocation
        };
        await (0, actions_1.addRequest)(input_config, act_sniffer_mame);
    }
    else if (answer == ProviderValue.execute) {
        // id for existing request
        // or same fields as addRequest to add a new one and execute it 
        /* 	const id="5551";
            await executeAction(id); */
    }
})();
