import fs from "fs";
import os from "os";
import path from "path";
import ServerAxios from "./serverAxios.js";

const saveLoginToFile = (jwt) => {
  const homeDirectory = os.homedir();
  const configDirectory = path.join(homeDirectory, ".sharkio");
  const configPath = path.join(configDirectory, "config.json");

  const configData = {
    jwt,
  };

  if (!fs.existsSync(configDirectory)) {
    fs.mkdirSync(configDirectory);
  }

  fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
  ServerAxios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
};

const loadLoginFromFile = () => {
  const homeDirectory = os.homedir();
  const configDirectory = path.join(homeDirectory, ".sharkio");
  const configPath = path.join(configDirectory, "config.json");

  if (!fs.existsSync(configPath)) {
    return null;
  }

  const configData = fs.readFileSync(configPath, "utf-8");

  const data = JSON.parse(configData);
  if (!data.jwt) {
    return null;
  }
  ServerAxios.defaults.headers.common["Authorization"] = `Bearer ${data.jwt}`;
  return data;
};

export { saveLoginToFile, loadLoginFromFile };
