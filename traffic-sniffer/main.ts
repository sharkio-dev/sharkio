require("dotenv/config");
import { SnifferManagerController } from "./lib/request-metadata/sniffer-manager/sniffer-manager-controller";

const adminPort = +(process.env.ADMIN_PORT ?? 5012);

const snifferController = new SnifferManagerController();
snifferController.start(adminPort);
