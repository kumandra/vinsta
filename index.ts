import { createVirtualMachine } from './qemu/create_vm'; // Adjust the path if needed
import { removeVirtualMachine } from './qemu/remove_vm';
import type { VMOptions } from './qemu/VMOptionsType';

// Example usage
const vmOptions: VMOptions = {
  name: "koompi",
  iso: "koompi",
  ram: "4096",
  disk: "15G",
  cpu: "2",
  network: "default",
  bootOption: 'uefi',
  arch: 'x64'
};

createVirtualMachine(vmOptions)
  .then(() => {
    console.log("Virtual machine created successfully.");
  })
  .catch((error) => {
    console.error("Failed to create virtual machine:", error);
  });

// removeVirtualMachine({ name: vmOptions.name })
// .then(() => {
//   console.log("Virtual machine removed successfully.");
// })
// .catch((error) => {
//   console.error("Failed to remove virtual machine:", error);
// });