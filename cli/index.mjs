import { program } from "commander";
import login from "./commands/login.js";
import createSniffer from "./commands/createSniffer.js";
import { loadLoginFromFile } from "./commands/utils.js";
import chalk from "chalk";
import boxen from "boxen";

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
  console.log(description);
  console.log(msgBox);
};

const main = async () => {
  loadLoginFromFile();

  program.name("sharkio-cli").description(printGreetings());

  program
    .command("login")
    .description("🦈 Login to Sharkio")
    .action(login)
    .option("-r, --reset", "Reset login");

  program
    .command("create")
    .description("🦈 Create entities")
    .command("sniffer")
    .action(createSniffer)
    .description("🦈 Create a sniffer")
    .option("-n, --name <name>", "Name of the sniffer")
    .option("-p, --port <port>", "Port of the sniffer");

  program
    .command("list")
    .description("🦈 List entities")
    .command("sniffers")
    .action(() => {});

  program
    .command("start")
    .description("🦈 Start a sniffer")
    .command("sniffer")
    .description("🦈 Start a sniffer")
    .option("-n, --name <name>", "Name of the sniffer")
    .action(() => {});

  program.parse();
};

main();
