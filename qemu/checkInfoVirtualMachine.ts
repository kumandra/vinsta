import type { VMOptions } from '../types/VMOptionsType';
import { getIPFromCommandOutput } from '../shells/getIPFromCommandOutput';
import { getStatusFromOutput } from '../shells/getStatusFromOutput';
import { executeCommand } from '../shells/executeCommand';
import { delay } from '../utils/delay';

export const checkInfoVirtualMachine = async (options: VMOptions): Promise<{ message: string; vmInfo?: { status?: string; memoryUsage?: string; cpuCores?: number; ipAddress?: string } }> => {  const { name = "koompi" } = options;

  try {
      // Check if VM exists
      const vmExistsOutput = await executeCommand(`virsh dominfo ${name}`);
      if (!vmExistsOutput.includes("Name:")) {
        throw new Error(`Virtual machine "${name}" not found`);
      }
  
      // Check VM state
      const vmStateOutput = await executeCommand(`virsh domstate ${name}`);
      if (!vmStateOutput.includes("running")) {
        console.log(`Virtual machine "${name}" is not running. Starting...`);
        await executeCommand(`virsh start ${name}`);
  
        // Wait for a short period to allow VM to start
        console.log("Waiting for VM to start...");
        await delay(10000); // Wait 10 seconds (adjust as needed)
      }
    // Get VM details
    const vmInfoOutput = await executeCommand(`virsh dominfo ${name}`);

    // Extract relevant information
    const lines = vmInfoOutput.split('\n');
    let cpuCount: number | undefined;
    let usedMemory: number | undefined;
    let ipAddress: string | undefined;

    for (const line of lines) {
      if (line.startsWith('CPU(s):')) {
        cpuCount = parseInt(line.split(':')[1].trim());
      } else if (line.startsWith('Used memory:')) {
        usedMemory = parseInt(line.split(':')[1].trim()) / (1024 * 1024); // Convert KiB to MB
      }
    }

    // Get IP address using existing logic
    const ipCommand = `virsh domifaddr ${name}`;
    const ipOutput = await executeCommand(ipCommand);
    if (ipOutput) {
      ipAddress = getIPFromCommandOutput(ipOutput);
    } else {
      ipAddress = 'N/A';
    }

    // Log the information
    // console.log(`** Virtual Machine Information for "${name}"**`);
    // console.log(`  - Status: ${getStatusFromOutput(vmInfoOutput)}`); // Helper function for status
    // console.log(`  - Memory Usage: ${usedMemory?.toFixed(2) || 'N/A'} MB`); // Format memory (N/A if not found)
    // console.log(`  - CPU Cores: ${cpuCount || 'N/A'}`);
    // console.log(`  - IP Address: ${ipAddress || 'N/A'}`);


    const vmDetails = {
      status: getStatusFromOutput(vmInfoOutput),
      memoryUsage: usedMemory?.toFixed(2) + "MB" || 'N/A',
      cpuCores: cpuCount,
      ipAddress,
    };
        // Return an object with a message and VM details
        return {
          message: "Information of the instance",
          vmInfo: vmDetails,
        };

    // TODO Return VM Detail later on as json
  } catch (error) {
    console.error("An error occurred:", (error as Error).message);
    throw error; 
  }
};

