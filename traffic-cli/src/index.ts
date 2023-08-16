import { input } from "@inquirer/prompts";
import select, { Separator  } from "@inquirer/select";
import { showTitleAndBanner } from './utils/logger.util';
import { getReqlistAction, executeAction , addReqAction} from './actions/actions'; 
const { cyan, red, green } = require('kleur/colors');
import { Request, Response} from "express";
import {v4} from "uuid";
//import {Answer} from '../models/choice';

export enum ProviderValue {
  listRequests = "listRequests",
  addRequest = "addRequest",
  removeRequest = "removeRequest",
  execute = "execute",
}

const listOfCommands = [
  { name: "listRequests", value: ProviderValue.listRequests },
  { name: "addRequest", value: ProviderValue.addRequest },
  { name: "removeRequest", value: ProviderValue.removeRequest },
  { name: "execute", value: ProviderValue.execute },
];
export type Config = {
	url: string;
	sniffer_port: number
	//sniffer_mame: string;
	//server_port: number;
	method: string;
	invocation: Object;
	
};
//const providerAnswer: Answer = await providerQuestion(); 
showTitleAndBanner();
(async () => {
  const answer = await select({
	  	message: green("Please select a command"),
		choices: listOfCommands
  });
  if (answer == ProviderValue.listRequests)
	{
		await getReqlistAction();
	}
  else if (answer == ProviderValue.execute)
  {	  
	const act_url = await input({
		message: "Please enter url",
	    default: "http://localhost:5012"
	  });
    const act_method = await input({
	   message: "Please enter request method",
	   default: "GET"
	});
	const act_sniffer_port = await input({
	   message: "Please enter sniffer port",
	   default: "5551"
	});
	const body = await input({
	   message: "Please enter request body:",
	   default: ""
	});
	const headers = await input({
	   message: "Please enter request headers:",
	   default: ""
	});
	const cookies = await input({
	   message: "Please enter request cookies:",
	   default: ""
	});
	const params = await input({
	   message: "Please enter request params:",
	   default: ""
	});
	const act_sniffer_port_num = +act_sniffer_port
	const timestamp= new Date();
	const act_id = v4();
	const act_invocation = {"id": act_id, "timestamp":timestamp, "body":body, "headers":headers, "cookies": cookies, "params":params
	}
	const input_config: Config = {
		url: act_url,
		//sniffer_mame: act_sniffer_mame,
		sniffer_port: act_sniffer_port_num,
        method: act_method,
		invocation: act_invocation
    }
	await executeAction(input_config);
  }
  else if (answer == ProviderValue.addRequest){
	const act_url = await input({
		message: "Please enter url",
	    default: "http://localhost:5012"
	  });
    const act_method = await input({
	   message: "Please enter request method",
	   default: "GET"
	});
	const act_sniffer_port = await input({
	   message: "Please enter sniffer port",
	   default: "5551"
	});
	const body = await input({
	   message: "Please enter request body:",
	   default: ""
	});
	const headers = await input({
	   message: "Please enter request headers:",
	   default: ""
	});
	const cookies = await input({
	   message: "Please enter request cookies:",
	   default: ""
	});
	const params = await input({
	   message: "Please enter request params:",
	   default: ""
	});
	const act_sniffer_port_num = +act_sniffer_port
	const timestamp= new Date();
	const act_id = v4();
	const act_invocation = {"id": act_id, "timestamp":timestamp, "body":body, "headers":headers, "cookies": cookies, "params":params
	}
	const input_config: Config = {
		url: act_url,
		//sniffer_mame: act_sniffer_mame,
		sniffer_port: act_sniffer_port_num,
        method: act_method,
		invocation: act_invocation
    }
	await addReqAction(input_config);
  }
  
})();
