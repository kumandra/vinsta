import { test, mock } from 'bun:test';
import { createVirtualMachine } from '../qemu/create_vm'; // Adjust the path if needed
import type { VMOptions } from '../types/VMOptionsType';
import { executeCommand } from '../shells/executeCommand'; // Mocked for testing
import { getIPFromCommandOutput } from '../shells/getIPFromCommandOutput'; // Mocked for testing
import { delay } from '../utils/delay'; // Mocked for testing

describe('createVirtualMachine', () => {
  afterEach(() => {
    bun.resetMocks(); // Reset mocks after each test
  });

  test('creates a virtual machine with default options (no ISO)', async () => {
    const options: VMOptions = {
      name: 'test-vm',
    };

    // Mock dependenciesmock(executeCommand).returns((command) => {
  // Assert expected commands are called
  expect(command).toContain('virt-install');
  expect(command).toContain('--name test-vm');
  expect(command).toContain('--import'); // No ISO specified
  return Promise.resolve(''); // Simulate successful execution
});
    mock(delay).implement(() => Promise.resolve()); // Simulate no delay

    await createVirtualMachine(options);

    // No need to test actual execution (mocks handle that)
    // We can focus on asserting expected behavior
  });

  test('creates a virtual machine with custom options and ISO', async () => {
    const options: VMOptions = {
      name: 'test-vm-with-iso',
      iso: 'ubuntu',
      ram: '4096',
      disk: '30G',
      cpu: '4',
      network: 'br0',
      osVariant: 'debian11',
      bootOption: 'uefi',
      arch: 'x86_64',
    };

    // Mock dependencies with more complex assertions
    mock(executeCommand).implement((command) => {
      expect(command).toContain('virt-install');
      expect(command).toContain('--name test-vm-with-iso');
      expect(command).toContain('--ram 4096');
      expect(command).toContain('--disk path=images/test-vm-with-iso.qcow2,format=qcow2');
      expect(command).toContain('--network network=br0,model=virtio');
      expect(command).toContain('--os-variant debian11');
      expect(command).toContain('--boot loader=/usr/share/OVMF/x64/OVMF_CODE.fd,loader.readonly=yes,loader.type=pflash,nvram.template=/usr/share/OVMF/x64/OVMF_VARS.fd'); // UEFI boot
      expect(command).toContain('--cdrom iso/ubuntu*.iso'); // ISO specified
      return Promise.resolve(''); // Simulate successful execution
    });
    mock(delay).implement(() => Promise.resolve()); // Simulate no delay
    mock(getIPFromCommandOutput).implement(() => '192.168.1.10'); // Mock IP retrieval

    await createVirtualMachine(options);

    // No need to test actual execution (mocks handle that)
    // We can focus on asserting expected behavior
  });

  test('throws an error for invalid RAM size format', async () => {
    const options: VMOptions = {
      name: 'test-vm',
      ram: 'invalid-ram',
    };

    await expect(createVirtualMachine(options)).rejects.toThrowError(
      'Invalid RAM size format. Use a numeric value for RAM.'
    );
  });

  test('throws an error for invalid disk size format', async () => {
    const options: VMOptions = {
      name: 'test-vm',
      disk: 'invalid-disk',
    };

    await expect(createVirtualMachine(options)).rejects.toThrowError(
      'Invalid disk size format. Use a number followed by \'G\' or \'M\' for disk.'
    );
  });
});
