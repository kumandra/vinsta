import { executeCommand } from "../shells/executeCommand";
import type { VMOptions } from "../types/VMOptionsType";

export const startVirtualMachine = async (options: VMOptions): Promise<void> => {
  const { name = "koompi" } = options;
  try {
   // Check if VM exists
   const vmExistsOutput = await executeCommand(`virsh dominfo ${name}`);
   if (!vmExistsOutput.includes("Name:")) {
     throw new Error(`Virtual machine "${name}" not found`);
   }
   
    // Check status of the VM
    const vmStatusOutput = await executeCommand(`virsh domstate ${name}`);
    if (!vmStatusOutput.includes("running")) {
      console.log(`Virtual machine is not running. Starting...`);
      await executeCommand(`virsh start ${name}`); // Attempt to start the VM
    } else {
      console.log(`VM is already running.`);
    }
  } catch (error: any) {
    // Log error message with VM name
    console.log(`Failed to start virtual machine "${name}": ${error.message}`);
    // Throw error to stop execution
    throw error;
  } finally {
    // Optional: Additional actions regardless of success or failure (e.g., logging)
  }
};