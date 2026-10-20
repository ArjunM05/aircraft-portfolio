<script lang="ts">
	import { visitPaths } from '#lib/data/hero.js';
	import { getSectionIndex } from '#lib/data/sections.js';
	import { useGuidedTour } from '#lib/guided-tour-context.js';

	const tour = useGuidedTour();

	const availablePaths = visitPaths
		.map((path) => ({
			path,
			stopCount: path.stops.filter((sectionId) => getSectionIndex(sectionId) !== -1).length
		}))
		.filter((entry) => entry.stopCount > 0);
</script>

<section class="visit-guide" aria-labelledby="visit-guide-title">
	<h3 id="visit-guide-title">How much time do you have?</h3>

	<div class="path-list">
		{#each availablePaths as { path, stopCount } (path.id)}
			<button type="button" class="path-card" onclick={() => tour.start(path)}>
				<span class="path-duration">{path.duration}</span>
				<span class="path-title">{path.title}</span>
				<span class="path-description">{path.description}</span>
				<span class="path-stops">{stopCount} stops &rarr;</span>
			</button>
		{/each}
	</div>
</section>

<style>
	.visit-guide h3 {
		margin: 0 0 10px;
	}

	.path-list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 10px;
	}

	.path-card {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 4px;
		padding: 12px;
		background: none;
		border: 1px solid var(--line);
		color: inherit;
		text-align: left;
		cursor: pointer;
		transition:
			border-color 0.15s,
			transform 0.15s,
			background 0.15s;
	}

	.path-card:hover {
		border-color: var(--cyan);
		background: var(--grid);
		transform: translateY(-2px);
	}

	.path-card:focus-visible {
		outline: 2px solid var(--cyan);
		outline-offset: 2px;
	}

	.path-duration {
		font: 11px var(--mono);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--amber);
	}

	.path-title {
		font: 700 16px var(--sans);
		color: var(--cyan);
	}

	.path-description {
		font: 13px/1.4 var(--sans);
		color: var(--dim);
	}

	.path-stops {
		margin-top: auto;
		padding-top: 6px;
		font: 12px var(--mono);
	}

	@media (prefers-reduced-motion: reduce) {
		.path-card {
			transition: none;
		}
		.path-card:hover {
			transform: none;
		}
	}
</style>
