import { PathResponseData } from "../../../traffic-sniffer/types";
import { Request, Response } from "express";
import {Config} from "../index"
import fsSync from "fs";

export async function getReqlistAction(){

	const fileData = fsSync.readFileSync("src/openapi.json", "utf8");
	const parsedData = JSON.parse(fileData);
	// Go through the open-api file
	const arr = parsedData.paths;

	 // const obj = Object.fromEntries(arr);
	 // console.log(obj)
	  for (const [key, value] of Object.entries(arr)) {	
		const arr2 = Object(value);
		console.log(`${key}: ${Object.keys(arr2)}`);
		
		
	  }
	return


}
export function getEndPoints(){
	const endPoints = new Array()
	const fileData = fsSync.readFileSync("src/openapi.json", "utf8");
	const parsedData = JSON.parse(fileData);
	// Go through the open-api file
	const arr = parsedData.paths;

	for (const [key, value] of Object.entries(arr)) {	
		const obj = {name: key, value:key } 
		endPoints.push(obj)
	}
	  
	return endPoints
}
export function getMethods(endPoints: string){
	//const methods = new Array()
	const fileData = fsSync.readFileSync("src/openapi.json", "utf8");
	const parsedData = JSON.parse(fileData);
	// Go through the open-api file
	const arr = parsedData.paths;
	const methods = Object.keys(arr[endPoints])
	const methods_obj = new Array();
	for (const value of methods) {	
		const obj = {name: value, value:value } 
		methods_obj.push(obj);
	}

	return methods_obj
}
export function getProperties(endPoint: string, method: string){
	//const methods = new Array()
	const fileData = fsSync.readFileSync("src/openapi.json", "utf8");
	const parsedData = JSON.parse(fileData);
	// Go through the open-api file
	const arr = parsedData.paths;
	try {
		const properties = Object.keys(arr[endPoint][method]["requestBody"]["content"]["application/json"]["schema"]["properties"]);
		return properties
	} catch (error) {
		console.log("No properties needed for this method");
		return
		
	}
}
	export function getServers(){
		const servers_arr = new Array()
		const fileData = fsSync.readFileSync("src/openapi.json", "utf8");
		const parsedData = JSON.parse(fileData);
		// Go through the open-api file
		const servers = parsedData.servers;
		for (const value of servers) {	
			const value_obj = Object(value);
			const server_string = Object.values(value_obj)[0]
			const obj = {name: server_string, value:server_string } 
			servers_arr.push(obj)
		}
		return servers_arr
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
	//const sniffer_port = config.sniffer_port;
	//const executionUrl = `${url}/sharkio/sniffer/${sniffer_port}/actions/execute`;
	const method = config.method;
	const invocation = config.invocation;

}
export async function addReqAction(config: Config){
	// this will have a new rout in the controller which will basically execute the log request in intercepted request
	// dowsn't work because  intercepted requests is private
	const url = config.url;
	//const sniffer_port = config.sniffer_port;
//	const executionUrl = `${url}/sharkio/sniffer/${sniffer_port}/actions/addRequest`;
	const method = config.method;
	const invocation = config.invocation;


}