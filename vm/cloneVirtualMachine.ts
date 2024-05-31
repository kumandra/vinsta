import { executeCommand } from '../shells/executeCommand';
import type { VMOptions } from '../types/VMOptionsType';

export const cloneVirtualMachine = async (options: VMOptions): Promise<void> => {
  const { name = "koompi" } = options;

  try {
    // Check if VM exists 
    const vmExistsOutput = await executeCommand(`virsh dominfo ${name}`);
    if (!vmExistsOutput.includes('Name:')) {
      throw new Error(`Virtual machine "${name}" not found`);
    }

    // Stop the virtual machine
    await executeCommand(`virsh stop ${name}`);
    console.log(`Virtual machine "${name}" stopped successfully.`);
  } catch (error) {
    console.error(`Error stopping virtual machine "${name}":`, (error as Error).message);
    // Handle other potential errors here (e.g., permission issues)
  }
};