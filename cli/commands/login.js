import inquirer from "inquirer";
import fs from "fs";
import os from "os";
import path from "path";

const saveLoginToFile = (email, token) => {
  const homeDirectory = os.homedir();
  const configDirectory = path.join(homeDirectory, "sharkio");
  const configPath = path.join(configDirectory, "config.json");

  const configData = {
    email,
    token,
  };

  if (!fs.existsSync(configDirectory)) {
    fs.mkdirSync(configDirectory);
  }

  fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
};

const loadLoginFromFile = () => {
  const homeDirectory = os.homedir();
  const configDirectory = path.join(homeDirectory, "sharkio");
  const configPath = path.join(configDirectory, "config.json");

  if (!fs.existsSync(configPath)) {
    return null;
  }

  const configData = fs.readFileSync(configPath, "utf-8");

  return JSON.parse(configData);
};

const validateEmail = (input) => {
  // Validate email
  return true;
};

const validateToken = (input) => {
  // Validate token
  return true;
};

async function login() {
  const data = loadLoginFromFile();

  // if (data) {
  //   console.log("Already logged in.");
  //   return;
  // }

  // Dynamically import inquirer

  // Use inquirer.prompt as needed
  const { email, token } = await inquirer.prompt([
    {
      type: "input",
      name: "email",
      message: "Enter your email:",
      validate: () => validateToken(),
    },
    {
      type: "password",
      name: "token",
      message: "Enter your token:",
      mask: "*",
      validate: () => validateToken(),
    },
  ]);

  saveLoginToFile(email, token);

  // // Send a request to your API for validation
  // try {
  //   const response = await axios.post("YOUR_API_ENDPOINT", {
  //     email,
  //     token,
  //   });

  //   if (response.data.isValid) {
  //     console.log("Initialization successful!");
  //     console.log("Configuration saved.");
  //   } else {
  //     console.error("Invalid email or token. Please try again.");
  //   }
  // } catch (error) {
  //   console.error("Error occurred while validating:", error);
  // }
}

export default login;
