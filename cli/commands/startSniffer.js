import ngrok from "ngrok";
import chalk from "chalk";
import inquirer from "inquirer";
import { getSniffers, patchSniffer } from "./api.js";

const getLocalUrl = (port) => `http://localhost:${port}`;
const getSnifferUrl = (name) => `https://${name}.localhost.sharkio.dev`;

const startSniffer = async (params) => {
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
      // chalk.green(`\n🦈 Sniffer ${chalk.bold(sniffer.name)} is running!`);
      const snifferUrl = `https://${sniffer.name}.localhost.sharkio.dev`;
      const localUrl = `http://localhost:${sniffer.port}`;
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
