<script lang="ts">
	import { useGuidedTour } from '#lib/guided-tour-context.js';

	const tour = useGuidedTour();
</script>

{#if tour.activePath}
	<div class="tour-bar" role="region" aria-label="Guided tour">
		<div class="tour-info">
			<span class="tour-name">{tour.activePath.title}</span>
			<span class="tour-progress">Stop {tour.stopNumber + 1} of {tour.stops.length}</span>
			<span class="tour-dots" aria-hidden="true">
				{#each tour.stops as stop, index (stop)}
					<span class="dot" class:done={index <= tour.stopNumber}></span>
				{/each}
			</span>
		</div>

		<div class="tour-actions">
			<button type="button" onclick={() => tour.previous()} disabled={tour.stopNumber === 0}>
				Back
			</button>
			<button type="button" class="primary" onclick={() => tour.next()}>
				{tour.isLastStop ? 'Finish' : 'Next stop \u203A'}
			</button>
			<button type="button" aria-label="End the tour" onclick={() => tour.stop()}>&times;</button>
		</div>
	</div>
{/if}

<style>
	.tour-bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 8px 16px;
		padding: 8px 12px;
		background: var(--grid);
		border-bottom: 1px solid var(--cyan);
	}

	.tour-info {
		display: flex;
		align-items: center;
		gap: 10px;
		font: 12px var(--mono);
	}

	.tour-name {
		color: var(--cyan);
		font-weight: 600;
	}

	.tour-progress {
		color: var(--dim);
	}

	.tour-dots {
		display: flex;
		gap: 4px;
	}

	.dot {
		width: 14px;
		height: 3px;
		background: var(--dim);
		opacity: 0.4;
		transition: opacity 0.2s;
	}

	.dot.done {
		background: var(--cyan);
		opacity: 1;
	}

	.tour-actions {
		display: flex;
		gap: 6px;
	}

	button {
		padding: 5px 10px;
		background: none;
		border: 1px solid var(--line);
		color: var(--line);
		font: 12px var(--mono);
		cursor: pointer;
	}

	button:disabled {
		opacity: 0.35;
		cursor: default;
	}

	button.primary {
		background: var(--cyan);
		border-color: var(--cyan);
		color: var(--bg);
		font-weight: 600;
	}

	button:focus-visible {
		outline: 2px solid var(--cyan);
		outline-offset: 2px;
	}
</style>
