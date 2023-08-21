import axios from 'axios';
import { PathResponseData } from "../../../traffic-sniffer/types";
import { Request, Response } from "express";
import {Config} from "../index"
import fsSync from "fs";
//import {InterceptedRequests} from  "../../../traffic-sniffer/lib/intercepted-requests"


//requests = new InterceptedRequests();
export async function getReqlistAction(){

	const fileData = fsSync.readFileSync("src/openapi.json", "utf8");
	const parsedData = JSON.parse(fileData);
	// Go through the open-api file
	console.log(Object.keys(parsedData.paths));
	parsedData.paths.forEach(function (value: string) {
		console.log(value);
	});
	const answer = await axios.get("http://localhost:5012/sharkio/sniffer/invocation");
// TODO print only data
	console.log(answer);
	return


}

/* export async function addReqAction(request: Request){
	invocations.push({
	id: v4(),
	timestamp: new Date(),
	body: this.config.recordBodies === true ? request.body : undefined,
	headers: this.config.recordBodies === true ? request.headers : undefined,
	cookies: this.config.recordBodies === true ? request.cookies : undefined,
	params: this.config.recordParams === true ? request.params : undefined,
    });
	//	await axios.post("http://localhost:5012",{
	//	});
	
} */
export async function executeAction(config: Config){
	const url = config.url;
	const sniffer_port = config.sniffer_port;
	const executionUrl = `${url}/sharkio/sniffer/${sniffer_port}/actions/execute`;
	const method = config.method;
	const invocation = config.invocation;
	const answer = await axios.post(executionUrl,
    { url, method, invocation },
/*     {
      headers: {
        "Content-Type": "application/json",
      },
    } */
    );
  	console.log(answer); 
}
export async function addReqAction(config: Config){
	// this will have a new rout in the controller which will basically execute the log request in intercepted request
	// dowsn't work because  intercepted requests is private
	const url = config.url;
	const sniffer_port = config.sniffer_port;
	const executionUrl = `${url}/sharkio/sniffer/${sniffer_port}/actions/addRequest`;
	const method = config.method;
	const invocation = config.invocation;
	const answer = await axios.post(executionUrl,
    { url, method, invocation },
/*     {
      headers: {
        "Content-Type": "application/json",
      },
    } */
    );
  	console.log(answer); 

}