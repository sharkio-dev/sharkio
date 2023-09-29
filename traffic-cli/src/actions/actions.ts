import {Config} from "../index"
import fsSync from "fs";

export async function getReqlistAction(){

	const fileData = fsSync.readFileSync("src/openapi.json", "utf8");
	const parsedData = JSON.parse(fileData);
	// Go through the open-api file
	const arr = parsedData.paths;
	  for (const [key, value] of Object.entries(arr)) {	
		const arr2 = Object(value);
		const method = Object.keys(arr2)[0] as string;

		console.log(method.toUpperCase() + ": " + `${key}`);

	  }
	return


}
// functions for the execute command to extract the relevant fields from the open-api file
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
		const obj = {name: value.toUpperCase(), value:value.toUpperCase() } 
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

export async function executeAction(config: Config){
	const url = config.url;
	const method = config.method;


}
