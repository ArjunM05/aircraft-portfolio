<script lang="ts">
	import { SHOW_SAMPLE_BADGES } from '#lib/data/site-config.js';
	import type { Section } from '#lib/data/types.js';

	interface Props {
		section: Pick<Section, 'title' | 'aircraftPartName' | 'partExplanation' | 'hasSampleContent'>;
		/** Blueprint view shows which aircraft part the section belongs to. Plain view hides that. */
		showAircraftContext?: boolean;
	}

	let { section, showAircraftContext = true }: Props = $props();

	const showsSampleBadge = $derived(SHOW_SAMPLE_BADGES && section.hasSampleContent);
</script>

<header class="section-header">
	<div class="title-row">
		<h2>{section.title}</h2>

		{#if showAircraftContext}
			<span class="part-chip">
				<span class="part-chip-label">Aircraft part</span>{section.aircraftPartName}
			</span>
		{/if}

		{#if showsSampleBadge}<span class="sample-badge">sample data</span>{/if}
	</div>

	{#if showAircraftContext}
		<details class="part-note">
			<summary>Why the {section.aircraftPartName.toLowerCase()}?</summary>
			<p class="part-explanation">{section.partExplanation}</p>
		</details>
	{/if}
</header>

<style>
	.section-header {
		margin-bottom: 6px;
	}

	.title-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px 12px;
	}

	h2 {
		margin: 0;
		font: 600 clamp(26px, 3vw, 36px) / 1.1 var(--sans);
	}

	.part-chip {
		padding: 2px 8px;
		border: 1px solid var(--amber);
		color: var(--amber);
		font: 11px var(--mono);
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.part-chip-label {
		margin-right: 6px;
		color: var(--dim);
	}

	.part-note {
		margin: 6px 0 0;
	}

	.part-note summary {
		display: inline-block;
		cursor: pointer;
		font: 12px var(--mono);
		color: var(--dim);
		list-style: none;
	}

	.part-note summary::-webkit-details-marker {
		display: none;
	}

	.part-note summary::before {
		content: '+ ';
		color: var(--amber);
	}

	.part-note[open] summary::before {
		content: '- ';
	}

	.part-note summary:hover {
		color: var(--line);
	}

	.part-note summary:focus-visible {
		outline: 2px solid var(--cyan);
		outline-offset: 2px;
	}

	.part-note .part-explanation {
		margin: 4px 0 0;
	}
</style>
