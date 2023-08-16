"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addReqAction = exports.executeAction = exports.getReqlistAction = void 0;
const axios_1 = __importDefault(require("axios"));
//requests = new InterceptedRequests();
async function getReqlistAction() {
    // POST something to the server 
    await axios_1.default.get("http://localhost:5012/sharkio/sniffer");
    await axios_1.default.get("http://localhost:5012/sharkio/sniffer");
    await axios_1.default.get("http://localhost:5012/sharkio/sniffer");
    //await axios.post("http://localhost:3000");
    //await axios.post("http://localhost:5012");
    //await axios.post("http://localhost:5012");
    const answer = await axios_1.default.get("http://localhost:5012/sharkio/sniffer/invocation");
    // TODO print only data
    console.log(answer);
    return;
}
exports.getReqlistAction = getReqlistAction;
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
async function executeAction(config) {
    const url = config.url;
    const sniffer_port = config.sniffer_port;
    const executionUrl = `${url}/sharkio/sniffer/${sniffer_port}/actions/execute`;
    const method = config.method;
    const invocation = config.invocation;
    const answer = await axios_1.default.post(executionUrl, { url, method, invocation });
    console.log(answer);
}
exports.executeAction = executeAction;
async function addReqAction(config) {
    // this will have a new rout in the controller which will basically execute the log request in intercepted request
    // dowsn't work because  intercepted requests is private
    const url = config.url;
    const sniffer_port = config.sniffer_port;
    const executionUrl = `${url}/sharkio/sniffer/${sniffer_port}/actions/addRequest`;
    const method = config.method;
    const invocation = config.invocation;
    const answer = await axios_1.default.post(executionUrl, { url, method, invocation });
    console.log(answer);
}
exports.addReqAction = addReqAction;
