<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		subtitle?: string;
		/** Accordions with the same group name close each other (one open at a time). */
		groupName?: string;
		startsOpen?: boolean;
		showSampleBadge?: boolean;
		children: Snippet;
	}

	let {
		title,
		subtitle,
		groupName,
		startsOpen = false,
		showSampleBadge = false,
		children
	}: Props = $props();
</script>

<details class="accordion" name={groupName} open={startsOpen}>
	<summary class="accordion-summary">
		<span class="accordion-title">{title}</span>
		{#if subtitle}
			<span class="meta-text">
				{subtitle}
				{#if showSampleBadge}<span class="sample-badge">sample data</span>{/if}
			</span>
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

	.accordion-body {
		padding: 0 12px 12px;
	}
</style>
