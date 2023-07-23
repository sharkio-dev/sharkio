import axios from 'axios';
import { PathResponseData } from "../../../traffic-sniffer/types";
import { Request, Response } from "express";
import {Config} from "../index"
export async function getReqlistAction(){

	
	// POST something to the server 
	await axios.post("http://localhost:5012");
	await axios.post("http://localhost:5012");
	await axios.post("http://localhost:5012");
	const answer = await axios.get<PathResponseData>("http://localhost:5012/sharkio/sniffer/invocation");
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
	//const url = config.url;
	const method = config.method;
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
  	console.log(answer);
}