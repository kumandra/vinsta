import { executeCommand } from '../shells/executeCommand';
import type { VMOptions } from '../types/VMOptionsType';

export const startVirtualMachine = async (options: VMOptions): Promise<void> => {
  const { name = "koompi" } = options;

  try {
       // Check if VM exists 
       const vmExistsOutput = await executeCommand(`virsh dominfo ${name}`);
       if (!vmExistsOutput.includes('Name:')) {
         throw new Error(`Virtual machine "${name}" not found`);
       }
  } catch (error) {
    console.log(`Virtual machine "${name}" not exists`); // Log error message with VM name

  }

  try {
    // Start the VM
    await executeCommand(`virsh start ${name}`);
    console.log(`Virtual machine "${name}" starting...`); // Log error message with VM name
  } catch (error) {
    // Assuming any error during start indicates VM might not exist
    console.log(`Failed to start virtual machine "${name}"`); // Log error message with VM name
  } finally {
    // Optional: Additional actions regardless of success or failure (e.g., logging)
  }
};
