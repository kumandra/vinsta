#!/usr/bin/env bun

import { Command } from "commander";
import { createVirtualMachine, stopVirtualMachine, startVirtualMachine, removeVirtualMachine, checkInfoVirtualMachine} from "./cmd";
import { listallVirtualMachine } from "./cmd/listallVirtualMachine";
import { initVinsta } from "./cmd/initVinsta";
const figlet = require("figlet");

const program = new Command();

console.log(figlet.textSync("Vinsta"));

program
  .version("1.0.0")
  .description("Vinsta for managing your virtual machine")
  .option("-i, --init", "Connect to the Vinsta server")
  .option("-c, --create", "Create a new virtual machine")
  .option("-s, --start", "Start a virtual machine")
  .option("-o, --stop", "Stop a virtual machine")
  .option("-r, --remove", "Remove a virtual machine")
  .option("-k, --check", "Check information of a virtual machine")
  .option("-l, --listall", "List all of the available virtual machine")
  .parse(process.argv);

const options = program.opts();

// Check if no options are provided other than the script name
if (process.argv.length <= 2) {
  program.help(); // Display help message
}

if (options.init) {
  initVinsta().catch((error) => {
    console.error("Error during initialization:", error);
  });
}
if (options.create) {
  createVirtualMachine();
}
if (options.start) {
  startVirtualMachine();
}

if (options.stop) {
  stopVirtualMachine();
}

if (options.remove) {
  removeVirtualMachine();
}

if (options.check) {
  checkInfoVirtualMachine();
}
if (options.listall) {
  listallVirtualMachine();
}

if (options.config) {
  listallVirtualMachine();
}
