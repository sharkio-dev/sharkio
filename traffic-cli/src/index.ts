import { input } from "@inquirer/prompts";
import select from "@inquirer/select";
import { v4 } from "uuid";
import { executeAction, getReqlistAction } from "./actions/actions";
import { showTitleAndBanner } from "./utils/logger.util";
const { green } = require("kleur/colors");

export enum ProviderValue {
  listRequests = "listRequests",
  addRequest = "addRequest",
  removeRequest = "removeRequest",
  execute = "execute",
  quit = "quit",
}

const listOfCommands = [
  { name: "listRequests", value: ProviderValue.listRequests },
  { name: "execute", value: ProviderValue.execute },
  { name: "quit", value: ProviderValue.quit },
];

export type Config = {
  url: string;
  sniffer_port: number;
  method: string;
  invocation: Object;
};

const main = async () => {
  showTitleAndBanner();

  while (true) {
    const answer = await select({
      message: green("Please select a command"),
      choices: listOfCommands,
    });
    let shouldQuit = false;

    switch (answer) {
      case ProviderValue.listRequests: {
        await getReqlistAction();
        break;
      }
      case ProviderValue.quit: {
        shouldQuit = true;
        break;
      }
      case ProviderValue.execute: {
        const act_url = await input({
          message: "Please enter url",
          default: "http://localhost:5012",
        });
        const act_method = await input({
          message: "Please enter request method",
          default: "GET",
        });
        const act_sniffer_port = await input({
          message: "Please enter sniffer port",
          default: "5551",
        });
        const body = await input({
          message: "Please enter request body:",
          default: "",
        });
        const headers = await input({
          message: "Please enter request headers:",
          default: "",
        });
        const cookies = await input({
          message: "Please enter request cookies:",
          default: "",
        });
        const params = await input({
          message: "Please enter request params:",
          default: "",
        });
        const act_sniffer_port_num = +act_sniffer_port;
        const timestamp = new Date();
        const act_id = v4();
        const act_invocation = {
          id: act_id,
          timestamp: timestamp,
          body: body,
          headers: headers,
          cookies: cookies,
          params: params,
        };
        const input_config: Config = {
          url: act_url,
          //sniffer_mame: act_sniffer_mame,
          sniffer_port: act_sniffer_port_num,
          method: act_method,
          invocation: act_invocation,
        };
        await executeAction(input_config);
        break;
      }
      default: {
        console.log("Command was not recognized. try again.");
      }
    }

    if (shouldQuit) {
      break;
    }
  }
};

main();
