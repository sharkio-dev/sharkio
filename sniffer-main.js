require("dotenv/config");
const { SnifferManagerController } = require('traffic-sniffer');

const adminPort = +(process.env.ADMIN_PORT ?? 5012);
const snifferController = new SnifferManagerController();

snifferController.start(adminPort);
