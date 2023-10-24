import { program } from "commander";
import login from "./commands/login.js";

const main = async () => {
  program.name("sharkio-cli").description("Sharkio CLI").version("1.0.0");

  program
    .command("login")
    .description("Login to your Sharkio account")
    .action(login);

  program.parse();
};

main();
