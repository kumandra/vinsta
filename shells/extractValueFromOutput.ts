export function extractValueFromOutput(output: string, key: string): string | undefined {
  if (!output) {
    return undefined;
  }

  const lines = output.split('\n');
  for (const line of lines) {
    if (line.startsWith(key)) {
      return line.split(':')[1].trim();
    }
  }

//   console.warn(`Value for key "${key}" not found in output`);  // Optional logging
  return 'N/A';
}
