require("dotenv/config");
import { SnifferManager } from "./lib/request-metadata/sniffer-manager/sniffer-manager";
import { SnifferManagerController } from "./lib/request-metadata/sniffer-manager/sniffer-manager-controller";
import { MockManagerController } from "./lib/request-metadata/sniffer-manager/mock-manager-controller";
import { SnifferManagerServer } from "./lib/request-metadata/sniffer-manager/sniffer-manager-server";


const snifferManager = new SnifferManager();
const snifferController = new SnifferManagerController(snifferManager);
const mockManagerController = new MockManagerController(snifferManager);
const snifferManagerServer = new SnifferManagerServer([
  snifferController,
  mockManagerController,
]);

snifferManagerServer.start();

snifferManager.createSniffer({
  port: 5020,
  downstreamUrl: "http://localhost:5555",
  name: "mock",
  id: "",
});

snifferManager.getSniffer(5020)?.start();
