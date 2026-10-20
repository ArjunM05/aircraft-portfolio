<script lang="ts">
	import { tick } from 'svelte';
	import type { PaletteEntry } from '#lib/search/palette-entries.js';
	import { searchEntries } from '#lib/search/search-entries.js';
	import { isTypingTarget } from '#lib/browser-helpers.js';

	interface Props {
		entries: PaletteEntry[];
		open?: boolean;
	}

	let { entries, open = $bindable(false) }: Props = $props();

	const RESULT_LIMIT_WITH_QUERY = 8;
	const RESULT_LIMIT_WITHOUT_QUERY = 10;

	let query = $state('');
	let activeIndex = $state(0);
	let dialogElement = $state<HTMLDialogElement>();
	let inputElement = $state<HTMLInputElement>();

	const results = $derived(
		searchEntries(
			entries,
			query,
			query.trim() ? RESULT_LIMIT_WITH_QUERY : RESULT_LIMIT_WITHOUT_QUERY
		)
	);
	const activeEntry = $derived(results[activeIndex]);

	// Open or close the native <dialog> whenever `open` changes.
	$effect(() => {
		if (!dialogElement) return;

		if (open && !dialogElement.open) {
			query = '';
			activeIndex = 0;
			dialogElement.showModal();
			tick().then(() => inputElement?.focus());
		} else if (!open && dialogElement.open) {
			dialogElement.close();
		}
	});

	// Keep the highlighted row visible while moving with the arrow keys.
	$effect(() => {
		if (!open) return;
		document.getElementById(`palette-option-${activeIndex}`)?.scrollIntoView({ block: 'nearest' });
	});

	function handleGlobalKeydown(event: KeyboardEvent) {
		const isShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
		if (isShortcut) {
			event.preventDefault();
			open = !open;
			return;
		}

		if (event.key === '/' && !open && !isTypingTarget(event.target)) {
			event.preventDefault();
			open = true;
		}
	}

	function handleInputKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			activeIndex = Math.min(activeIndex + 1, results.length - 1);
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			activeIndex = Math.max(activeIndex - 1, 0);
		} else if (event.key === 'Enter' && activeEntry) {
			event.preventDefault();
			choose(activeEntry);
		}
	}

	function choose(entry: PaletteEntry) {
		open = false;
		entry.run();
	}

	/** A click on the dimmed backdrop lands on the <dialog> element itself. */
	function handleDialogClick(event: MouseEvent) {
		if (event.target === dialogElement) open = false;
	}
</script>

<svelte:window onkeydown={handleGlobalKeydown} />

<!-- svelte-ignore a11y_no_noninteractive_element_interactions, a11y_click_events_have_key_events -->
<dialog
	class="palette"
	bind:this={dialogElement}
	aria-label="Search the portfolio"
	onclick={handleDialogClick}
	onclose={() => (open = false)}
>
	<div class="palette-body">
		<input
			bind:this={inputElement}
			bind:value={query}
			class="palette-input"
			type="text"
			role="combobox"
			aria-expanded="true"
			aria-autocomplete="list"
			aria-controls="palette-results"
			aria-activedescendant={activeEntry ? `palette-option-${activeIndex}` : undefined}
			placeholder="Search sections, projects, skills or actions..."
			autocomplete="off"
			spellcheck="false"
			oninput={() => (activeIndex = 0)}
			onkeydown={handleInputKeydown}
		/>

		<ul id="palette-results" class="palette-results" role="listbox" aria-label="Results">
			{#each results as entry, index (entry.id)}
				<li
					id="palette-option-{index}"
					class="palette-option"
					class:active={index === activeIndex}
					role="option"
					aria-selected={index === activeIndex}
					tabindex="-1"
					onclick={() => choose(entry)}
					onmousemove={() => (activeIndex = index)}
				>
					<span class="palette-label">{entry.label}</span>
					{#if entry.detail}<span class="palette-detail">{entry.detail}</span>{/if}
					<span class="palette-group">{entry.group}</span>
				</li>
			{:else}
				<li class="palette-empty" role="presentation">No matches for &ldquo;{query}&rdquo;</li>
			{/each}
		</ul>

		<p class="palette-hints" aria-hidden="true">
			<kbd>&uarr;</kbd><kbd>&darr;</kbd> move &nbsp; <kbd>Enter</kbd> open &nbsp; <kbd>Esc</kbd> close
		</p>
	</div>
</dialog>

<style>
	.palette {
		width: min(560px, calc(100vw - 24px));
		margin: 12vh auto 0;
		padding: 0;
		background: var(--panel);
		border: 1px solid var(--cyan);
		color: inherit;
	}

	.palette::backdrop {
		background: rgb(5 20 40 / 0.72);
		backdrop-filter: blur(2px);
	}

	.palette-body {
		display: flex;
		flex-direction: column;
		max-height: 70vh;
	}

	.palette-input {
		padding: 14px 16px;
		background: none;
		border: 0;
		border-bottom: 1px solid var(--grid);
		color: inherit;
		/* 16px keeps iPhones from zooming into the field. */
		font: 16px var(--mono);
	}

	.palette-input:focus {
		outline: none;
		border-bottom-color: var(--cyan);
	}

	.palette-results {
		margin: 0;
		padding: 4px 0;
		overflow-y: auto;
		list-style: none;
	}

	.palette-option {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 0 12px;
		padding: 8px 16px;
		border-left: 2px solid transparent;
		cursor: pointer;
	}

	.palette-option.active {
		background: var(--grid);
		border-left-color: var(--cyan);
	}

	.palette-label {
		font: 600 14px var(--sans);
	}

	.palette-detail {
		grid-column: 1;
		font: 11px var(--mono);
		color: var(--dim);
	}

	.palette-group {
		grid-column: 2;
		grid-row: 1;
		align-self: center;
		font: 10px var(--mono);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--amber);
	}

	.palette-empty {
		padding: 14px 16px;
		font: 13px var(--mono);
		color: var(--dim);
	}

	.palette-hints {
		margin: 0;
		padding: 8px 16px;
		border-top: 1px solid var(--grid);
		font: 11px var(--mono);
		color: var(--dim);
	}

	kbd {
		margin-right: 4px;
		padding: 0 5px;
		border: 1px solid var(--grid);
		font: inherit;
	}
</style>
