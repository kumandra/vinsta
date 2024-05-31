import { checkInfoVirtualMachine } from './vm/checkInfoVirtualMachine';
import { createVirtualMachine } from './vm/createVirtualMachine'; // Adjust the path if needed
import { removeVirtualMachine } from './vm/removeVirtualMachine';
import { startVirtualMachine } from './vm/startVirtualMachine';
import { stopVirtualMachine } from './vm/stopVirtualMachine';
import type { VMOptions } from './types/VMOptionsType';



import express from 'express';
import vmRoutes from './routes/vmRoutes';
import bodyParser from 'body-parser';

const app = express();

app.use(express.json());

app.use('/api', vmRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});















// Example usage
// const vmOptions: VMOptions = {
//   name: "koompi",
//   iso: "koompi",
//   ram: "4096",
//   disk: "15G",
//   cpu: "2",
//   network: "br10",
//   bootOption: 'uefi',
//   arch: 'x64'
// };

// createVirtualMachine(vmOptions)
//   .then(() => {
//     console.log("Virtual machine created successfully.");
//   })
//   .catch((error) => {
//     console.error("Failed to create virtual machine:", error);
//   });

// removeVirtualMachine({ name: vmOptions.name })

// checkInfoVirtualMachine({ name: vmOptions.name })

// startVirtualMachine({ name: vmOptions.name })

// stopVirtualMachine({ name: vmOptions.name })

// listAllVirtualMachine()
// .then(() => {
//   console.log("Listing all the virtual machine available.");
// })
// .catch((error) => {
//   console.error("Failed to list all virtual machine:", error);
// });


