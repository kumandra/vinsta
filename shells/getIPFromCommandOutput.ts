export const getIPFromCommandOutput = (output: string): string | undefined => {    
    const lines = output.split('\n');
    // Find the line containing "ipv4"
    const ipv4Line = lines.find(line => line.includes('ipv4'));
    if (!ipv4Line) {
        return undefined; // Return null if "ipv4" line is not found
    }
    // Extract the IP address using regular expression
    const ipAddressMatch = ipv4Line.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/);
    if (!ipAddressMatch) {
        return undefined; // Return null if IP address is not found
    }
    return ipAddressMatch[0]; // Return the first matched IP address
  };
  