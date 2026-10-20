<script lang="ts">
	import { disciplineLabels, type Discipline } from '#lib/data/sections.js';
	import type { CaseStudy } from '#lib/data/types.js';
	import { useExplorer } from '#lib/explorer-context.js';
	import { rankTechnologies } from '#lib/search/portfolio-index.js';

	interface Props {
		projects: CaseStudy[];
		visibleCount: number;
	}

	let { projects, visibleCount }: Props = $props();

	const MAX_TECHNOLOGY_CHIPS = 10;

	const explorer = useExplorer();

	const disciplines = $derived(
		(Object.keys(disciplineLabels) as Discipline[]).filter((discipline) =>
			projects.some((project) => project.disciplines.includes(discipline))
		)
	);

	const technologies = $derived(
		rankTechnologies(projects, MAX_TECHNOLOGY_CHIPS, explorer.technologyFilter)
	);
</script>

<div class="filter-bar" role="group" aria-label="Filter projects">
	<div class="filter-row">
		<span class="filter-label">Area</span>
		{#each disciplines as discipline (discipline)}
			<button
				type="button"
				class="filter-chip"
				class:selected={explorer.disciplineFilter === discipline}
				aria-pressed={explorer.disciplineFilter === discipline}
				onclick={() => explorer.toggleDiscipline(discipline)}
			>
				{disciplineLabels[discipline]}
			</button>
		{/each}
	</div>

	<div class="filter-row">
		<span class="filter-label">Tech</span>
		{#each technologies as technology (technology)}
			<button
				type="button"
				class="filter-chip"
				class:selected={explorer.technologyFilter === technology}
				aria-pressed={explorer.technologyFilter === technology}
				onclick={() => explorer.toggleTechnology(technology)}
			>
				{technology}
			</button>
		{/each}
	</div>

	<p class="filter-status" aria-live="polite">
		Showing {visibleCount} of {projects.length}
		{#if explorer.hasProjectFilter}
			<button type="button" class="clear-button" onclick={() => explorer.clearProjectFilters()}>
				Clear filters
			</button>
		{/if}
	</p>
</div>

<style>
	.filter-bar {
		margin: 8px 0 12px;
	}

	.filter-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px;
		margin: 6px 0;
	}

	.filter-label {
		min-width: 34px;
		font: 10px var(--mono);
		color: var(--dim);
		text-transform: uppercase;
	}

	.filter-chip {
		padding: 3px 10px;
		background: none;
		border: 1px solid var(--grid);
		color: inherit;
		font: 12px var(--mono);
		cursor: pointer;
		transition:
			border-color 0.15s,
			background 0.15s;
	}

	.filter-chip:hover {
		border-color: var(--cyan);
	}

	.filter-chip.selected {
		background: var(--cyan);
		border-color: var(--cyan);
		color: var(--bg);
	}

	.filter-chip:focus-visible,
	.clear-button:focus-visible {
		outline: 2px solid var(--amber);
		outline-offset: 2px;
	}

	.filter-status {
		margin: 8px 0 0;
		font: 12px var(--mono);
		color: var(--dim);
	}

	.clear-button {
		margin-left: 8px;
		padding: 0;
		background: none;
		border: 0;
		border-bottom: 1px solid var(--amber);
		color: var(--amber);
		font: inherit;
		cursor: pointer;
	}
</style>
