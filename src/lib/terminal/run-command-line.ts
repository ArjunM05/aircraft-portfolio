import type { CommandResult, TerminalCommand } from './commands.js';

/** Turns a typed line such as "cd projects" into a command run. */
export function runCommandLine(line: string, commands: readonly TerminalCommand[]): CommandResult {
	const [rawName, ...args] = line.trim().split(/\s+/);
	const command = commands.find((candidate) => candidate.name === rawName.toLowerCase());

	if (!command) return { lines: [`command not found: ${rawName}. Type 'help' for the list.`] };
	return command.run(args) ?? {};
}
