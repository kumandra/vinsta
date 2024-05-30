import { createVirtualMachine } from './qemu'; // Adjust the path if needed

// Example usage
const vmOptions = {
  name: "koompi",
  iso: "iso/koompi*.iso",
  ram: "4098",
  disk: "10G",
  cpu: "2",
  network: "default",
  osVariant: "archlinux"
  // ip: "10.2.0.99",
  // subnetMask: "255.255.255.0",
  // gateway: "10.2.0.1",
  // dns: "8.8.8.8"
};

createVirtualMachine(vmOptions)
  .then(() => {
    console.log("Virtual machine created successfully.");
  })
  .catch((error) => {
    console.error("Failed to create virtual machine:", error);
  });
