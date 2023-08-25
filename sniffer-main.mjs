import { SnifferManagerController } from "traffic-sniffer";
import dotenv from "dotenv";
dotenv.config();

const adminPort = +(process.env.ADMIN_PORT ?? 5012);
const snifferController = new SnifferManagerController();

snifferController.start(adminPort);
