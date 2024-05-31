// Optional helper function to extract status (can be expanded for other properties)
export function getStatusFromOutput(output: string): string {
    const lines = output.split('\n');
    for (const line of lines) {
      if (line.startsWith('State:')) {
        return line.split(':')[1].trim();
      }
    }
    return 'Unknown'; // Default if not found
  }
  