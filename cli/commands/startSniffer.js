import chalk from "chalk";
import ngrok from "ngrok";
import { createLocalSniffers } from "./api.js";
import { ProxyServer } from '../lib/proxy-server/proxy-server.mjs'
const getLocalUrl = (port) => `http://localhost:${port}`;
const getSnifferUrl = (subdomain) => `https://${subdomain}.sniffer.sharkio.dev`;

const startSniffer = async (name, options, command) => {
  try {
    const ports = command.args.map((val) => {
      const number = Number.parseInt(val);

      if (Number.isNaN(number)) {
        throw new Error("Invalid port provided must be an integer");
      }

      return number;
    });

    const proxyServer = new ProxyServer();
    const server = await proxyServer.start(50000);
    const url = await ngrok.connect(50000);

    const sniffers = await createLocalSniffers({ ports, downstreamUrl: url }).then((res) => res.data);

    const selectedSniffers = sniffers;

    if (selectedSniffers.length < 1) {
      console.log(
        chalk.bgBlue.white.bold("\n🌊 Ocean Warning! \n") +
        chalk.blue("You need to select at least one sniffer to start.\n"),
      );
      process.exit(1);
    }

    selectedSniffers.forEach((sniffer) => {
      const snifferUrl = getSnifferUrl(sniffer.subdomain);
      const localUrl = getLocalUrl(sniffer.port);

      console.log(
        chalk.green(
          `🌊 Forwarding ${chalk.bold(snifferUrl)} to ${chalk.bold(
            localUrl,
          )}`,
        ),
      );
    });
  } catch (err) {
    const errorMessage =
      chalk.bgBlue.white.bold("\n🌊 Ocean Warning! \n") +
      chalk.blue(
        "The waters are choppy! Couldn't run the sniffers.\nTry casting your net again later.\n",
      );

    console.log(errorMessage);
    ngrok.kill();
  }
};

export default startSniffer;
