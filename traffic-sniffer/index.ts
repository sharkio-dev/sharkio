import { Sniffer } from "./lib/request-metadata/sniffer/sniffer";

require("dotenv/config");
var args = process.argv.slice(2);
console.log("args");
console.log("args[0]" + args[0]);
console.log("args[1]" + args[1]);

const sniffer = new Sniffer({
  port: +(args[0] ?? 5012),
  downstreamUrl: args[1] ?? "http://localhost:3000",
});

sniffer.start();
