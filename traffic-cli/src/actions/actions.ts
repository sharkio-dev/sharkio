import axios from 'axios';
import { PathResponseData } from "../../../traffic-sniffer/types";
import { Request, Response } from "express";
import {Config} from "../index"
import {InterceptedRequests} from  "../../../traffic-sniffer/lib/intercepted-requests"

//requests = new InterceptedRequests();
export async function getReqlistAction(){

	
	// POST something to the server 
	await axios.get("http://localhost:5012/sharkio/sniffer");
	await axios.get("http://localhost:5012/sharkio/sniffer");
	await axios.get("http://localhost:5012/sharkio/sniffer");
	//await axios.post("http://localhost:3000");
	//await axios.post("http://localhost:5012");
	//await axios.post("http://localhost:5012");
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
export async function addRequest(config: Config,sniffer_name: string){
	// this will have a new rout in the controller which will basically execute the log request in intercepted request
/* 	{
  "url": "www.google.com",
  "method": "GET",
  "invocation": {
    "id": "string",
    "timestamp": "string",
    "body": "string",
    "headers": {
      "key": "value"
    },
    "cookies": {
      "key": "value"
    },
    "params": {
      "key": "value"
    }
  }
} */
	const executionUrl = `http://localhost:5012/sharkio/sniffer/5551/actions/execute`;
	const url = 'http://localhost:5012/'
	//TODO switch config to a request
	//TODO how to get sniffer's port
	//console.log(config.url);
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
//	requests.interceptRequest(req, sniffer_name)
}
export async function executeAction(config: Config){
	//this will be able to execute a detaied configuration or an id of a logged request
	//const url = config.url;
/*  	const method = config.method;
	const invocation = config.invocation;
	const sniffer_port = config.sniffer_port;
	const server_port = config.server_port;
	const executionUrl = `http://localhost:${server_port}/sharkio/sniffer/${sniffer_port}/actions/execute`;
	//TODO switch config to a request
	//TODO how to get sniffer's port
	//console.log(config.url);
	const answer = await axios.post(executionUrl,
    { executionUrl, method, invocation },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
    );
  	console.log(answer);  */
}