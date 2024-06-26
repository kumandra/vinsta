import inquirer from "inquirer";
import { getServerConfig } from "../utils/config";
import ora from 'ora';
import axios from "axios";

export async function startVirtualMachine() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Enter the name of the virtual machine:",
      default: "koompi-vm-1",
    },
  ]);
  const spinner = ora("Sending request...").start(); // Start spinner instance
  
  // Read environment variables from $HOME/.vinsta/env
  const serverConfig = getServerConfig();
  if (!serverConfig) {
    return;
  }

  const { host, port } = serverConfig;
  const url = `http://${host}:${port}/api/start`;


  try {
    const response = await axios.post(url, answers, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    // Check if the virtual machine was successfully started
    if (response.data.message === "Virtual Machine is starting") {
      spinner.succeed("Virtual machine started successfully"); // Stop spinner on success
    } else {
      spinner.fail("Failed to start virtual machine"); // Stop spinner on error
      console.error("Server response:", response.data);
    }
  } catch (error: any) {
    spinner.fail("Error sending request to the server"); // Stop spinner on error
    if (error.response) {
      // Server responded with a status other than 200 range
      console.error("Server responded with an error:", error.response.status, error.response.data);
    } else if (error.request) {
      // No response received
      console.error("No response received from the server:", error.request);
    } else {
      // Something else caused the error
      console.error("Error sending request to the server:", error.message);
    }
  }
}
