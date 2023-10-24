import inquirer from "inquirer";
import { loadLoginFromFile, saveLoginToFile } from "./utils.js";
import fs from "fs";
import os from "os";
import path from "path";
import ServerAxios from "./serverAxios.js";

async function login() {
  let data = loadLoginFromFile();

  if (!data?.email || !data?.token) {
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
  }
  const res = await ServerAxios.post("/login", data);
  console.log({ ...res });

  saveLoginToFile(res.email, res.token);
}

export default login;
