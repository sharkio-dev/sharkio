import ngrok from "ngrok";
import ServerAxios from "./serverAxios.js";
import chalk from "chalk";

const startSniffer = async (params) => {
  const name = params.name;
  const port = params.port;

  const url = await ngrok.connect(port);

  try {
    await ServerAxios.patch(`/sniffers`, {
      downstreamUrl: url,
      name,
      port,
    });

    const snifferName = name;
    const downstreamUrl = url;
    const localServer = `http://localhost:${port}`;
    const snifferUrl = `http://${snifferName}.localhost.sharkio.dev`;

    console.log(
      chalk.green(`\n🦈 Sniffer ${chalk.bold(snifferName)} is running!`),
    );
    console.log(
      chalk.greenBright(`\n${chalk.underline("Tunnel:")} ${downstreamUrl}`),
    );
    console.log(
      chalk.greenBright(`\n${chalk.underline("Local server:")} ${localServer}`),
    );
    console.log(
      chalk.greenBright(`\n${chalk.underline("Sniffer URL:")} ${snifferUrl}\n`),
    );
  } catch (err) {
    console.log(err);
    const errorMessage =
      chalk.bgBlue.white.bold("\n🌊 Ocean Warning! \n") +
      chalk.blue(
        "The waters are choppy! Couldn't run a sniffer. \nTry casting your net again later.\n",
      );

    console.log(errorMessage);
    ngrok.kill();
  }
};

export default startSniffer;
