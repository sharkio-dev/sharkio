import { input } from "@inquirer/prompts";
import select, { Separator  } from "@inquirer/select";
import { showTitleAndBanner } from './utils/logger.util';
import { getReqlistAction, executeAction } from './actions/actions'; 
const { cyan, red, green } = require('kleur/colors');
import { Request, Response} from "express";
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
	sniffer_port: number;
	server_port: number;
	method: string;
	invocation: string;
	
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
  else if (answer == ProviderValue.addRequest)
  {
	//  await addReqAction();
  }
  else if (answer == ProviderValue.execute){
	  //const request = new Request
	  const act_snif_port = await input({
		   message: "Please enter sniffer's port:",
		   default: '5551'
	  });
	  const act_snif_port_num: number = +act_snif_port;
	  //request.params = port;
	  const act_server_port = await input({
		   message: "Please enter server's port",
		   default: "5012"
	  });
	  const act_server_port_num: number = +act_server_port;
	  const act_method = await input({
	   message: "Please enter request method",
	   default: "GET"
	});
	  const act_invocation = await input({
	   message: "Please enter request invocation",
	   default: ""
	});
	//request.body = {url,method, invocation};
	const input_config: Config = {
		sniffer_port: act_snif_port_num,
		server_port: act_server_port_num,
        method: act_method,
		invocation: act_invocation
    }
	await executeAction(input_config);
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