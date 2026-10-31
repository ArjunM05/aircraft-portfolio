<script lang="ts">
	import { tick } from 'svelte';
	import { isTypingTarget } from '#lib/browser-helpers.js';
	import type { TerminalCommand } from '#lib/terminal/commands.js';
	import { runCommandLine } from '#lib/terminal/run-command-line.js';

	interface Props {
		commands: TerminalCommand[];
		open?: boolean;
	}

	let { commands, open = $bindable(false) }: Props = $props();

	interface OutputLine {
		kind: 'input' | 'output';
		text: string;
	}

	const PROMPT = 'pilot@a350:~$';
	const WELCOME_LINES = [
		'ARJUN-OS 3.50 | Airbus A350-900 build',
		"Type 'help' for the list of commands. Press Esc to leave."
	];

	let lines = $state<OutputLine[]>(WELCOME_LINES.map((text) => ({ kind: 'output', text })));
	let draft = $state('');
	let dialogElement = $state<HTMLDialogElement>();
	let inputElement = $state<HTMLInputElement>();
	let outputElement = $state<HTMLDivElement>();

	let submittedLines: string[] = [];
	let historyCursor = 0;

	$effect(() => {
		if (!dialogElement) return;

		if (open && !dialogElement.open) {
			dialogElement.showModal();
			tick().then(() => inputElement?.focus());
		} else if (!open && dialogElement.open) {
			dialogElement.close();
		}
	});

	// Keep the newest line in view.
	$effect(() => {
		void lines.length;
		if (outputElement) outputElement.scrollTop = outputElement.scrollHeight;
	});

	function isTerminalShortcut(event: KeyboardEvent): boolean {
		if (event.ctrlKey || event.metaKey || event.altKey) return false;
		// `code` is the physical key. It still matches on layouts where the backtick is a
		// "dead key" or needs Shift, and `key` still covers layouts that put it elsewhere.
		return event.code === 'Backquote' || event.key === '`';
	}

	function handleGlobalKeydown(event: KeyboardEvent) {
		if (isTerminalShortcut(event) && !open && !isTypingTarget(event.target)) {
			event.preventDefault();
			open = true;
		}
	}

	function submit() {
		const line = draft.trim();
		lines.push({ kind: 'input', text: `${PROMPT} ${draft}` });
		draft = '';
		if (!line) return;

		submittedLines.push(line);
		historyCursor = submittedLines.length;

		const result = runCommandLine(line, commands);
		if (result.clear) lines = [];
		for (const text of result.lines ?? []) lines.push({ kind: 'output', text });
		if (result.exit) open = false;
	}

	function recallHistory(direction: -1 | 1) {
		const nextCursor = Math.min(Math.max(historyCursor + direction, 0), submittedLines.length);
		historyCursor = nextCursor;
		draft = submittedLines[nextCursor] ?? '';
	}

	function completeCommandName() {
		const matches = commands.filter((command) =>
			command.name.startsWith(draft.trim().toLowerCase())
		);
		if (draft.trim() && matches.length === 1) draft = matches[0].name;
	}

	function handleInputKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			submit();
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			recallHistory(-1);
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();
			recallHistory(1);
		} else if (event.key === 'Tab') {
			event.preventDefault();
			completeCommandName();
		} else if (event.ctrlKey && event.key.toLowerCase() === 'l') {
			event.preventDefault();
			lines = [];
		}
	}

	/** Clicking the backdrop closes; clicking the text area focuses the prompt (unless selecting text). */
	function handleDialogClick(event: MouseEvent) {
		if (event.target === dialogElement) {
			open = false;
		} else if (!window.getSelection()?.toString()) {
			inputElement?.focus();
		}
	}
</script>

<svelte:window onkeydown={handleGlobalKeydown} />

<!-- svelte-ignore a11y_no_noninteractive_element_interactions, a11y_click_events_have_key_events -->
<dialog
	class="terminal"
	bind:this={dialogElement}
	aria-label="Terminal"
	onclick={handleDialogClick}
	onclose={() => (open = false)}
>
	<div class="terminal-output" role="log" aria-live="polite" bind:this={outputElement}>
		{#each lines as line, index (index)}
			<div class="terminal-line" class:input={line.kind === 'input'}>{line.text}</div>
		{/each}
	</div>

	<div class="terminal-prompt">
		<span class="prompt-label" aria-hidden="true">{PROMPT}</span>
		<input
			bind:this={inputElement}
			bind:value={draft}
			type="text"
			aria-label="Terminal command"
			autocomplete="off"
			autocapitalize="off"
			spellcheck="false"
			onkeydown={handleInputKeydown}
		/>
	</div>
</dialog>

<style>
	.terminal {
		width: min(680px, calc(100vw - 24px));
		height: min(420px, 70vh);
		margin: 10vh auto 0;
		padding: 0;
		background: #04101f;
		border: 1px solid var(--cyan);
		color: #9be8c4;
		font: 14px/1.5 var(--mono);
	}

	.terminal[open] {
		display: flex;
		flex-direction: column;
	}

	.terminal::backdrop {
		background: rgb(5 20 40 / 0.75);
	}

	.terminal-output {
		flex: 1;
		padding: 12px 14px 4px;
		overflow-y: auto;
	}

	.terminal-line {
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}

	.terminal-line.input {
		color: var(--cyan);
	}

	.terminal-prompt {
		display: flex;
		gap: 8px;
		padding: 6px 14px 12px;
	}

	.prompt-label {
		color: var(--amber);
		white-space: nowrap;
	}

	input {
		flex: 1;
		min-width: 0;
		padding: 0;
		background: none;
		border: 0;
		color: inherit;
		/* 16px keeps iPhones from zooming into the field. */
		font: 16px var(--mono);
		caret-color: var(--cyan);
	}

	input:focus {
		outline: none;
	}
</style>
