import ngrok from "ngrok";
import ServerAxios from "./serverAxios.js";
import chalk from "chalk";

const startSniffer = async (params) => {
  const name = params.name;
  const port = params.port;

  const url = await ngrok.connect(port);

  await ServerAxios.patch(`/sniffers`, {
    downstreamUrl: url,
    name,
    port,
  }).catch((err) => {
    const errorMessage =
      chalk.bgBlue.white.bold(" 🌊 Ocean Warning! \n") +
      chalk.blue(
        "The waters are choppy! Couldn't run a sniffer. \nTry casting your net again later.",
      );

    console.log(errorMessage);
  });

  const snifferName = name;
  const downstreamUrl = url;
  const localServer = `http://localhost:${port}`;

  const snifferMessage = [
    chalk.greenBright(`\n🦈 Sniffer ${chalk.bold(snifferName)} is running!`),
    chalk.greenBright(`\n${downstreamUrl} ${chalk.bold("-->")} ${localServer}`),
  ].join("");

  console.log(snifferMessage);
};

export default startSniffer;
