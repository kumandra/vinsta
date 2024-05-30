import type { VMOptions } from './VMOptionsType';
import { executeCommand } from '../shells/executeCommand';

export const removeVirtualMachine = async (options: VMOptions): Promise<void> => {
    const {
        name = "koompi",
      } = options;

      try {
        // Shutdown request domain
        await executeCommand(`virsh destroy ${name}`);

        // undefine request domain
        await executeCommand(`virsh undefine --nvram ${name}`);

        // delete the image of the request domain
        await executeCommand(`rm images/${name}.qcow2`);        
    
        
      } catch (error) {
        console.error("An error occurred:", (error as Error).message);
        throw error;
      }

}