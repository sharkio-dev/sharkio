import ngrok from "ngrok";
import chalk from "chalk";
import express from "express";
import cors from "cors";
import pkg from "body-parser";
const { json } = pkg;
import cookieParser from "cookie-parser";
import { urlencoded } from "express";
import inquirer from "inquirer";
import { getSniffers, patchSniffer } from "./api.js";

const getLocalUrl = (port) => `http://localhost:${port}`;
const getSnifferUrl = (name) => `https://${name}.localhost.sharkio.dev`;

class ProxyServer {
  app;
  constructor() {
    this.app = express();
    this.app.use(cors({ origin: "*" }));
    this.app.use(json());
    this.app.use(cookieParser());
    this.app.use(urlencoded({ extended: true }));
    // Add proxy middleware
  }

  async start(port) {
    return this.app.listen(port);
  }
}

const startSniffer = async () => {
  try {
    const sniffers = await getSniffers();
    const questions = [
      {
        type: "checkbox",
        name: "selectedOptions",
        message: "Select your options:\n",
        choices: sniffers.map((sniffer) => ({
          name: `${getSnifferUrl(sniffer.name)} -> ${getLocalUrl(
            sniffer.port,
          )}`,
          value: sniffer,
        })),
        validate: (answer) => {
          if (answer.length < 1) {
            return "You must choose at least one option.";
          }
          return true;
        },
      },
    ];

    const answers = await inquirer.prompt(questions);

    const selectedSniffers = answers.selectedOptions;
    if (selectedSniffers.length < 1) {
      console.log(
        chalk.bgBlue.white.bold("\n🌊 Ocean Warning! \n") +
          chalk.blue("You need to select at least one sniffer to start.\n"),
      );
      process.exit(1);
    }
    const proxyServer = new ProxyServer();
    const server = await proxyServer.start(50000);
    const url = await ngrok.connect(50000);

    selectedSniffers.forEach(async (sniffer) => {
      const { name, port } = sniffer;
      await patchSniffer({
        downstreamUrl: url,
        name,
        port,
      });
    });

    selectedSniffers.forEach((sniffer) => {
      const snifferUrl = getSnifferUrl(sniffer.name);
      const localUrl = getLocalUrl(sniffer.port);
      console.log(
        chalk.green(
          `🌊 Forwarding ${chalk.bold(snifferUrl)} to ${chalk.bold(
            localUrl,
          )}\n`,
        ),
      );
    });
  } catch (err) {
    console.log(err);
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
