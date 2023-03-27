import { Sniffer } from "./lib/request-metadata/sniffer/sniffer";

require("dotenv/config");
var args = process.argv.slice(2);

const sniffer = new Sniffer({
  port: +(args[0] ?? 5012),
  proxyUrl: args[1] ?? "http://localhost:3000",
});

sniffer.start();
