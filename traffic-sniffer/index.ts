import { Sniffer } from "./lib/request-metadata/sniffer/sniffer";

require("dotenv/config");
var args = process.argv.slice(2);
console.log("args");
console.log("args[0]" + args[0]);
console.log("args[1]" + args[1]);

const snifferPort = +(args[0] ?? process.env.SNIFFER_PORT ?? 5012);
const downstreamUrl =
  args[1] ?? process.env.DOWNSTREAM_URL ?? "http://localhost:5173";

const sniffer = new Sniffer({
  port: snifferPort,
  downstreamUrl,
});

sniffer.start();
