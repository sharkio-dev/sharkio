import { input } from "@inquirer/prompts";
import select from "@inquirer/select";
import { v4 } from "uuid";
import { executeAction, getReqlistAction, getEndPoints, getMethods,getProperties,getServers } from "./actions/actions";
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
  method: string;
  body: Object;
  server: string;
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
        // prints the endpoints and methods given in the open-api file
        await getReqlistAction();
        break;
      }
      case ProviderValue.quit: {
        shouldQuit = true;
        break;
      }
      case ProviderValue.execute: {
        // select a request to execute given in the open-api file
       const endPoints = getEndPoints();
        let act_url = await select({
          message: "Please select an end-point",
          choices: endPoints,
        });
        // get methods according to the chosen url
        const act_url_str = act_url as string
        const methods = getMethods(act_url_str);

        const act_method = await select({
          message: "Please select request method",
          choices: methods,
        });
        // get body parameters according to the chosen url,method
        let body = new Array();
        const act_method_str =  act_method as string;
        const properties = getProperties(act_url_str, act_method_str);
        if (Array.isArray(properties)){
          for (const propertyName of properties) {	
            const value = await input({
              message: "Please enter property " + propertyName + " value:",
              default: "",
            });
            const obj = {[propertyName]: value};
            body.push(obj);
            
          }
       }
       //console.log(body);
       // Select a server given in the open-api file
       const servers = getServers();
       const server = await select({
        message: "Please choose a server:",
        choices: servers,
      });
      
        //const timestamp = new Date();
        //const act_id = v4();
        const act_invocation: Config = {
          //id: act_id,
          //timestamp: timestamp,
          url: act_url as string,
          method: act_method as string,
          body: body,
          server: server as string,
        };

        await executeAction(act_invocation);
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
