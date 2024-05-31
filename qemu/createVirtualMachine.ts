import { getIPFromCommandOutput } from "../shells/getIPFromCommandOutput";
import { delay } from "../utils/delay";
import type { VMOptions } from "../types/VMOptionsType";
import { executeCommand } from "../shells/executeCommand";

// Function to create virtual machine
export const createVirtualMachine = async (
  options: VMOptions
): Promise<{ message: string; ipAddress?: string; sshCommand?: string; sshPassword?: string, }> => {
  const {
    name,
    iso = "koompi",
    ram = "1024",
    disk = "20G",
    cpu = "1",
    network = "default",
    osVariant = "archlinux",
    bootOption = "uefi",
    arch = "x64",
  } = options;

  try {
    // Check if VM exists
    const vmExistsOutput = await executeCommand(`virsh dominfo ${name}`);
    if (vmExistsOutput.includes("Name:")) {
      throw new Error(`Virtual machine "${name}" already created`);
    }
  } catch (error) {
    console.log(`Virtual machine "${name}" not exists`); // Log error message with VM name
  }

  try {
    // Validate RAM size format
    if (!ram.match(/^\d+$/)) {
      throw new Error("Invalid RAM size format. Use a numeric value for RAM.");
    }

    // Validate disk size format
    if (!disk.match(/^\d+[GM]$/)) {
      throw new Error(
        "Invalid disk size format. Use a number followed by 'G' or 'M' for disk."
      );
    }

    // Create virtual disk
    const diskFile: string = `images/${name}.qcow2`;
    await executeCommand(`qemu-img create -f qcow2 "${diskFile}" "${disk}"`);

    // Determine firmware paths based on architecture
    const firmwarePath =
      arch === "x86" ? "/usr/share/OVMF/ia32" : "/usr/share/OVMF/x64";
    const loaderFile = `${firmwarePath}/OVMF_CODE.fd`;
    const nvramTemplateFile = `${firmwarePath}/OVMF_VARS.fd`;

    // Build virt-install command
    let command: string = `virt-install --name ${name} --ram ${ram} --vcpus ${cpu} --disk path=${diskFile},format=qcow2 --network network=${network},model=virtio --os-variant=${osVariant} --features acpi=on,apic=on`;

    if (bootOption === "uefi") {
      // Add UEFI firmware option
      command += ` --boot loader=${loaderFile},loader.readonly=yes,loader.type=pflash,nvram.template=${nvramTemplateFile}`;
    } else {
      // Add MBR option
      command += ` --boot hd`;
    }

    if (iso && iso !== "" && iso !== " ") {
      command += ` --cdrom iso/${iso}*.iso`;
    } else {
      command += " --import";
    }

    // Execute virt-install command
    // console.log("virt-install command:");
    // console.log(command);
    await executeCommand(command);

    // Ensure the VM autostarts
    await executeCommand(`virsh autostart ${name}`);

    // Delay for 10 seconds to allow the VM to start up
    // await new Promise(resolve => setTimeout(resolve, 10000));
    await delay(10000);

    // Get the IP address of the VM
    const ipCommand = `virsh domifaddr ${name}`;
    const ipOutput = await executeCommand(ipCommand);
    const ipAddress = getIPFromCommandOutput(ipOutput);
    // if (ipAddress) {
    //   console.log(`IP address of ${name}: ${ipAddress}`);
    // } else {
    //   console.log(`No IP address found for ${name}`);
    // }

    // // Print SSH command if ISO starts with "koompi"
    // if (ipAddress && iso.startsWith("koompi")) {
    //   console.log("Now you can ssh into the instance, and install the OS");
    //   console.log("Username: koompilive");
    //   console.log("Password: 123");
    //   console.log(`ssh koompilive@${ipAddress}`);
    // }
    const sshCommand = ipAddress && iso.startsWith("koompi")
    ? `ssh koompilive@${ipAddress}`
    : undefined;
    const sshPassword = "123";
  // Return an object containing success message, IP address (if found), and SSH command (if applicable)
  return {
    message: "VM created successfully",
    ipAddress,
    sshCommand,
    sshPassword,
  };

  } catch (error) {
    console.error("An error occurred:", (error as Error).message);
    throw error;
  }
};

// Example usage:
// const vmOptions: VMOptions = {
//   name: "selendra",
//   iso: "koompi",
//   ram: "2048",
//   disk: "10G",
//   cpu: "2",
//   network: "default",
//   bootOption: 'uefi',
//   arch: 'x64'
// };

// createVirtualMachine(vmOptions);
