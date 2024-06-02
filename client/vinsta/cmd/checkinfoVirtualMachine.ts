import inquirer from "inquirer";

export async function checkInfoVirtualMachine() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Enter the name of the virtual machine:",
      default: "koompi-vm-1",
    },
  ]);

  console.log(`Virtual machine "${answers.name}" information checked`);
  // console.log(answers);
}