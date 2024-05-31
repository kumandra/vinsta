import { executeCommand } from "../shells/executeCommand";

export const listAllVirtualMachines = async (): Promise<void> => {
  try {
    // Use virsh list --all to list all virtual machines
    const vmListOutput = await executeCommand(`virsh list --all`);
    console.log("List of Virtual Machines:");
    console.log(vmListOutput); // Print the entire output

  } catch (error) {
    console.error("Error listing virtual machines:", (error as Error).message);
  }
};
