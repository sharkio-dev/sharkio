require("dotenv/config");
import { SnifferManager } from "./lib/sniffer-manager/sniffer-manager";
import { SnifferManagerController } from "./lib/sniffer-manager/sniffer-manager-controller";
import { MockManagerController } from "./lib/sniffer-manager/mock-manager-controller";
import { SnifferManagerServer } from "./lib/sniffer-manager/sniffer-manager-server";

const snifferManager = new SnifferManager();
const snifferController = new SnifferManagerController(snifferManager);
const mockManagerController = new MockManagerController(snifferManager);
const snifferManagerServer = new SnifferManagerServer([
  snifferController,
  mockManagerController,
]);

snifferManagerServer.start();
