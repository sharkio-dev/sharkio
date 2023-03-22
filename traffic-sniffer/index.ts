import { Sniffer } from "./lib/request-metadata/sniffer/sniffer";

require("dotenv/config");

const sniffer = new Sniffer({ port: 5012, proxyUrl: "http://localhost:3001" });
sniffer.start();
