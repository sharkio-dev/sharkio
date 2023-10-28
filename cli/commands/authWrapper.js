import { loadLoginFromFile } from "./utils.js";
import chalk from "chalk";

const AuthWrapper = (fn) => {
  return (...args) => {
    const data = loadLoginFromFile();

    if (!data) {
      const promptMessage =
        chalk.cyan.bold("\nReady to ride the Sharkio waves? 🌊") +
        chalk.cyan("\nBefore you dive in, remember to:\n") +
        chalk.whiteBright.bold("\n> sharkio login\n");
      console.log(promptMessage);
      return;
    }

    fn(...args);
  };
};

export default AuthWrapper;
