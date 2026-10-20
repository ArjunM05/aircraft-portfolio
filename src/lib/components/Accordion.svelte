<script lang="ts">
	import type { Snippet } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';

	interface Props {
		title: string;
		subtitle?: string;
		/** Accordions with the same group name close each other (one open at a time). */
		groupName?: string;
		startsOpen?: boolean;
		showSampleBadge?: boolean;
		/** Small teaser shown under the title while the card is closed. */
		preview?: Snippet;
		/** Stable id, so search and skill links can find this card. */
		cardId?: string;
		/** Set to true to ask the card to open itself and scroll into view. */
		reveal?: boolean;
		/** Called once the card has handled a reveal request, so the requester can reset it. */
		onrevealed?: () => void;
		/** Called when the visitor opens the card by clicking or with the keyboard. */
		onopen?: () => void;
		children: Snippet;
	}

	let {
		title,
		subtitle,
		groupName,
		startsOpen = false,
		showSampleBadge = false,
		preview,
		cardId,
		reveal = false,
		onrevealed,
		onopen,
		children
	}: Props = $props();

	const FLASH_DURATION_MS = 1400;

	const prefersReducedMotion = new MediaQuery('prefers-reduced-motion: reduce', false);

	let detailsElement = $state<HTMLDetailsElement>();
	let isFlashing = $state(false);
	let flashTimer: number | undefined;

	$effect(() => {
		if (!reveal || !detailsElement) return;

		detailsElement.open = true;
		detailsElement.scrollIntoView({
			block: 'nearest',
			behavior: prefersReducedMotion.current ? 'auto' : 'smooth'
		});

		isFlashing = true;
		window.clearTimeout(flashTimer);
		flashTimer = window.setTimeout(() => (isFlashing = false), FLASH_DURATION_MS);

		onrevealed?.();
	});

	// Stop the highlight timer when the card goes away.
	$effect(() => () => window.clearTimeout(flashTimer));

	function handleSummaryClick() {
		// The click happens before the browser toggles the card, so "closed now" means "opening".
		if (detailsElement && !detailsElement.open) onopen?.();
	}
</script>

<details
	bind:this={detailsElement}
	class="accordion"
	class:flash={isFlashing}
	name={groupName}
	open={startsOpen}
	data-card-id={cardId}
>
	<summary class="accordion-summary" onclick={handleSummaryClick}>
		<span class="accordion-title">{title}</span>
		{#if subtitle}
			<span class="meta-text">
				{subtitle}
				{#if showSampleBadge}<span class="sample-badge">sample data</span>{/if}
			</span>
		{/if}
		{#if preview}
			<span class="accordion-preview">{@render preview()}</span>
		{/if}
	</summary>

	<div class="accordion-body">
		{@render children()}
	</div>
</details>

<style>
	.accordion {
		margin: 10px 0;
		border: 1px solid var(--grid);
		background: rgba(95, 212, 255, 0.05);
		transition: border-color 0.15s;
	}

	.accordion:hover {
		border-color: var(--line);
	}

	.accordion.flash {
		animation: accordion-flash 1.4s ease-out;
	}

	@keyframes accordion-flash {
		0% {
			box-shadow: 0 0 0 2px var(--cyan);
		}
		100% {
			box-shadow: 0 0 0 2px transparent;
		}
	}

	.accordion-summary {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 10px 36px 10px 12px;
		cursor: pointer;
		list-style: none;
	}

	.accordion-summary::-webkit-details-marker {
		display: none;
	}

	.accordion-summary::after {
		content: '+';
		position: absolute;
		top: 8px;
		right: 12px;
		font: 20px var(--mono);
		color: var(--amber);
	}

	.accordion[open] > .accordion-summary::after {
		content: '-';
	}

	.accordion-summary:focus-visible {
		outline: 2px solid var(--cyan);
		outline-offset: -2px;
	}

	.accordion-title {
		font: 600 18px/1.2 var(--sans);
	}

	.accordion-preview {
		display: block;
		margin-top: 6px;
	}

	/* The teaser is only for closed cards. */
	.accordion[open] > .accordion-summary .accordion-preview {
		display: none;
	}

	.accordion-body {
		padding: 0 12px 12px;
	}

	@media (prefers-reduced-motion: reduce) {
		.accordion,
		.accordion.flash {
			transition: none;
			animation: none;
		}
	}
</style>
