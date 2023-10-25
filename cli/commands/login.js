import inquirer from "inquirer";
import { loadLoginFromFile, saveLoginToFile } from "./utils.js";
import fs from "fs";
import os from "os";
import path from "path";
import ServerAxios from "./serverAxios.js";
import chalk from "chalk";

async function login({ reset }) {
  let data = loadLoginFromFile();

  if (reset || !data?.email || !data?.token) {
    data = await inquirer.prompt([
      {
        type: "input",
        name: "email",
        message: "Enter your email:",
        validate: () => true,
      },
      {
        type: "password",
        name: "token",
        message: "Enter your token:",
        mask: "*",
        validate: () => true,
      },
    ]);
    const res = await ServerAxios.post("/login", data).catch((err) => {
      return err.response;
    });
    if (res.status !== 200) {
      const errorMessage = chalk.red.bold(
        "\n🚫 Login failed. \n\nSomething seems fishy... 🐟\n",
      );
      console.log(errorMessage);
      return;
    }

    saveLoginToFile(data.email, data.token);
    const message = chalk.green.bold(
      "\n🎉 Login succeeded! \n\nWelcome aboard, Sharkio sailor! 🦈\n",
    );
    console.log(message);
  }
}

export default login;
