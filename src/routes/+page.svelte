<script lang="ts">
	import { sections, profile, SHOW_SAMPLE_BADGES } from '$lib/data/sections';
</script>

<svelte:head>
	<title>{profile.name} | {profile.jobTitle}</title>
</svelte:head>

<main class="drawing-board">
	<p class="part-label">Step 2 check: {sections.length} sections loaded</p>
	<h1>{profile.name}</h1>

	<ol class="section-list">
		{#each sections as section, index (section.id)}
			<li>
				<span class="section-number">{index + 1}</span>
				<strong>{section.title}</strong>
				<span class="meta-text">{section.aircraftPartName} / {section.kind}</span>
				{#if SHOW_SAMPLE_BADGES && section.hasSampleContent}
					<span class="sample-badge">sample data</span>
				{/if}
			</li>
		{/each}
	</ol>
</main>

<style>
	.drawing-board {
		min-height: 100svh;
		padding: 48px 24px;
		background:
			linear-gradient(var(--grid) 1px, transparent 1px) 0 0 / 24px 24px,
			linear-gradient(90deg, var(--grid) 1px, transparent 1px) 0 0 / 24px 24px,
			var(--bg);
	}
	h1 {
		font: 600 clamp(36px, 6vw, 64px) / 1.05 var(--sans);
		margin: 0 0 16px;
	}
	.section-list {
		max-width: 640px;
		padding-left: 0;
		list-style: none;
	}
	.section-list li {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 10px;
		padding: 6px 0;
		border-bottom: 1px solid var(--grid);
	}
	.section-number {
		font: 12px var(--mono);
		color: var(--amber);
		width: 24px;
	}
</style>
