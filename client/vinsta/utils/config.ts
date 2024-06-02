import * as fs from "fs";
import * as path from "path";
import os from "os";
import ora from "ora"; // Import ora library

export function getServerConfig() {
  const homeDir = os.homedir();
  const envFilePath = path.join(homeDir, ".vinsta", "env");
  const spinner = ora("Reading configuration...").start(); // Create spinner instance

  if (!fs.existsSync(envFilePath)) {
    spinner.fail("Configuration file not found");
    console.error("Configuration file not found. Please run `vinsta --init` to set up.");
    return null;
  }

  const envConfig = fs.readFileSync(envFilePath, "utf-8")
    .split("\n")
    .reduce((acc, line) => {
      const [key, value] = line.split("=");
      if (key && value) {
        acc[key.trim()] = value.trim();
      }
      return acc;
    }, {} as Record<string, string>);

  const host = envConfig["HOST"];
  const port = envConfig["PORT"];

  if (!host || !port) {
    spinner.fail("Host or Port not defined");
    console.error("HOST or PORT not defined in the configuration file.");
    return null;
  }

  spinner.succeed("Configuration loaded successfully");
  return { host, port };
}