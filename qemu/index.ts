import { exec } from 'child_process';

interface VMOptions {
  name: string;
  iso?: string;
  ram?: string;
  disk?: string;
  cpu?: string;
  network?: string;
  osVariant?: string;
}

// Function to execute shell command
const executeCommand = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      if (stderr) {
        reject(new Error(stderr));
        return;
      }
      resolve(stdout);
    });
  });
};

// Function to create virtual machine
export const createVirtualMachine = async (options: VMOptions): Promise<void> => {
  const {
    name,
    iso = "",
    ram = "1024",
    disk = "20G",
    cpu = "1",
    network = "nat0",
    osVariant = "archlinux"
  } = options;

  try {
    // Validate RAM size format
    if (!ram.match(/^\d+$/)) {
      throw new Error("Invalid RAM size format. Use a numeric value for RAM.");
    }

    // Validate disk size format
    if (!disk.match(/^\d+[GM]$/)) {
      throw new Error("Invalid disk size format. Use a number followed by 'G' or 'M' for disk.");
    }

    // Create virtual disk
    const diskFile: string = `images/${name}.qcow2`;
    await executeCommand(`qemu-img create -f qcow2 "${diskFile}" "${disk}"`);

    // Build virt-install command
    let command: string = `virt-install --name ${name} --ram ${ram} --vcpus ${cpu} --disk path=${diskFile},format=qcow2 --network network=default,model=virtio --os-variant=${osVariant}`;

    if (iso && iso !== "" && iso !== " ") {
      command += ` --cdrom ${iso}`;
    } else {
      command += " --import";
    }

    // Execute virt-install command
    console.log("virt-install command:");
    console.log(command);
    await executeCommand(command);

    // Ensure the VM autostarts
    await executeCommand(`virsh autostart ${name}`);
  } catch (error) {
    console.error("An error occurred:", (error as Error).message);
    throw error;
  }
};

// Example usage:
// const vmOptions: VMOptions = {
//   name: "selendra",
//   iso: "iso/*.iso",
//   ram: "2048",
//   disk: "10G",
//   cpu: "2",
//   network: "default"
// };

// createVirtualMachine(vmOptions);
