import { executeCommand } from './executeCommand';

export function removeKnownHosts(IP_address: String) {
    const removeKnownSSH = `sed '/^${IP_address}/d' ~/.ssh/known_hosts > ~/.ssh/known_hosts`;
    executeCommand(removeKnownSSH)
}