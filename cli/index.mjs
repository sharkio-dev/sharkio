import { program } from "commander";
import login from "./commands/login.js";
import createSniffer from "./commands/createSniffer.js";
import { loadLoginFromFile } from "./commands/utils.js";

const main = async () => {
  loadLoginFromFile();

  program.name("sharkio-cli").description("Sharkio CLI").version("1.0.0");

  program
    .command("login")
    .description("Login to your Sharkio account")
    .action(login);

  program
    .command("create")
    .description("Create an entity")
    .command("sniffer")
    .action(createSniffer)
    .option("-n, --name <name>", "Name of the sniffer")
    .option("-p, --port <port>", "Port of the sniffer");

  program
    .command("list")
    .description("List entities")
    .command("sniffers")
    .action(() => {});

  program
    .command("start")
    .command("sniffer")
    .option("-n, --name <name>", "Name of the sniffer")
    .action(() => {});

  program.parse();
};

main();
