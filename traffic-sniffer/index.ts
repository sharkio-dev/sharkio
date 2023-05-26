import { SnifferManager } from "./lib/request-metadata/sniffer-manager/sniffer-manager";
import { SnifferManagerController } from "./lib/request-metadata/sniffer-manager/sniffer-manager-controller";
import { SnifferController } from "./lib/request-metadata/sniffer/sniffer-controller";

require("dotenv/config");
var args = process.argv.slice(2);
console.log("args");
console.log("args[0]" + args[0]);
console.log("args[1]" + args[1]);

const demoSnifferPort = +(args[0] ?? process.env.SNIFFER_PORT ?? 5100);
const downstreamUrl =
  args[1] ?? process.env.DOWNSTREAM_URL ?? "http://localhost:5173";

const snifferController = new SnifferManagerController();
snifferController.start();

snifferController.getManager().createSniffer({
  downstreamUrl,
  port: demoSnifferPort,
  id: "1",
});

snifferController.getManager().getSniffer(demoSnifferPort)?.start();
