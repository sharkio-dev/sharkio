"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeAction = exports.getReqlistAction = void 0;
const axios_1 = __importDefault(require("axios"));
async function getReqlistAction() {
    // POST something to the server 
    await axios_1.default.post("http://localhost:5012");
    await axios_1.default.post("http://localhost:5012");
    await axios_1.default.post("http://localhost:5012");
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
    //const url = config.url;
    const method = config.method;
    const invocation = config.invocation;
    const sniffer_port = config.sniffer_port;
    const server_port = config.server_port;
    const executionUrl = `http://localhost:${server_port}/sharkio/sniffer/${sniffer_port}/actions/execute`;
    //TODO switch config to a request
    //TODO how to get sniffer's port
    //console.log(config.url);
    const answer = await axios_1.default.post(executionUrl, { executionUrl, method, invocation }, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    console.log(answer);
}
exports.executeAction = executeAction;
