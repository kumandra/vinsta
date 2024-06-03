import inquirer from "inquirer";
import * as fs from "fs";
import * as path from "path";
import os from "os";

export async function initVinsta() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "host",
      message: "Enter the host of the Vinsta server:",
      default: "192.168.0.1",
    },
    {
      type: "input",
      name: "port",
      message: "Enter the port of the Vinsta server:",
      default: "3333",
    },
  ]);

  const homeDir = os.homedir();
  const vinstaDir = path.join(homeDir, ".vinsta");
  const sshDir = path.join(homeDir, ".ssh");

  // Create the .vinsta directory if it doesn't exist
  if (!fs.existsSync(vinstaDir)) {
    fs.mkdirSync(vinstaDir, { recursive: true });
  }
  
// Define the SSH directory path and configuration content
const sshContent = `Host *\n    StrictHostKeyChecking no\n    UserKnownHostsFile=/dev/null`;

// Define the path to the SSH configuration file
const sshConfigPath = path.join(sshDir, "config");

// Write the SSH configuration content to the SSH configuration file
fs.writeFileSync(sshConfigPath, sshContent);

console.log("SSH configuration updated successfully.");


  const envFilePath = path.join(vinstaDir, "env");

  // Write the answers to .env
  const envContent = `HOST=${answers.host}\nPORT=${answers.port}\n`;
  fs.writeFileSync(envFilePath, envContent);

  console.log("Initialization state saved to " + envFilePath);
}

// Check if the script is run directly
if (process.argv[1] === __filename) {
  initVinsta().catch((error) => {
    console.error("Error during initialization:", error);
  });
}
