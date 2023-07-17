import { input, select } from "@inquirer/prompts";
import { green } from "kleur";
import { showTitleAndBanner } from './utils/logger.util';
import { listReqAction } from './actions'; 

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
//const providerAnswer: Answer = await providerQuestion();
 
showTitleAndBanner();
select({ choices: listOfCommands, message: "Please select a command" }).then((question) =>
      console.log(question))
	  .then((question) => {
		  if (question == ProviderValue.listRequests)
		  {
			   return await listReqAction();
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