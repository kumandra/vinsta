import { executeCommand } from "../shells/executeCommand";
import type { VMOptions } from "../types/VMOptionsType";

export const removeVirtualMachine = async (
  options: VMOptions
): Promise<void> => {
  const { name = "koompi" } = options;

  try {
    // Check if VM exists
    const vmExistsOutput = await executeCommand(`virsh dominfo ${name}`);
    if (!vmExistsOutput.includes("Name:")) {
      throw new Error(`Virtual machine "${name}" not found`);
    }
  } catch (error) {
    console.log(`Virtual machine "${name}" not exists`); // Log error message with VM name
  }

  try {
    // Shutdown request domain
    await executeCommand(`virsh destroy ${name}`);

    // undefine request domain
    await executeCommand(`virsh undefine --nvram ${name}`);

    // delete the image of the request domain
    await executeCommand(`rm images/${name}.qcow2`);
    console.log("Virtual machine removed successfully.");
  } catch (error) {
    // Assuming any error during start indicates VM might not exist
    console.log(`Failed to remove virtual machine "${name}"`); // Log error message with VM name
  } finally {
    // Optional: Additional actions regardless of success or failure (e.g., logging)
  }
};
