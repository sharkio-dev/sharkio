import { program } from "commander";
import login from "./commands/login.js";
import { loadLoginFromFile } from "./commands/utils.js";
import startSniffer from "./commands/startSniffer.js";
import chalk from "chalk";
import boxen from "boxen";
import listSniffers from "./commands/getSniffers.js";
import AuthWrapper from "./commands/authWrapper.js";

const printGreetings = () => {
  const greeting = chalk.white.bold("Welcome to Sharkio CLI! 🦈");

  const boxenOptions = {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    backgroundColor: "#555",
    borderColor: "cyan",
  };
  const description =
    chalk.cyan("  🌊 Dive in and ") +
    chalk.blueBright.bold("make a splash! 🌊");

  const msgBox = boxen(greeting, boxenOptions);
  return msgBox + "\n\n" + description;
};

const main = async () => {
  loadLoginFromFile();

  program.name("sharkio-cli").usage(printGreetings());

  program
    .command("login")
    .description("🦈 Login to Sharkio")
    .action(login)
    .option("-r, --reset", "Reset login");
  const sniffersCommand = program.command("sniffer").description("🦈 Actions");
  sniffersCommand
    .command("list")
    .description("🦈 List sniffers")
    .action(AuthWrapper(listSniffers));
  sniffersCommand
    .command("start <port>")
    .description("🦈 Start a sniffer")
    .action(AuthWrapper(startSniffer));

  program.parse();
};

main();
