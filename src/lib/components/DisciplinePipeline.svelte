<script lang="ts">
	import { disciplineLabels } from '#lib/data/disciplines.js';
	import type { Discipline } from '#lib/data/types.js';
	import { useNavigation } from '#lib/navigation-context.js';

	interface Props {
		/** The discipline of the section being shown. It is highlighted. */
		current: Discipline;
	}

	let { current }: Props = $props();

	const goToSection = useNavigation();
	const pipelineOrder: Discipline[] = ['frontend', 'backend', 'ai-ml'];
</script>

<p class="small-heading">One flight, three disciplines</p>
<div class="pipeline">
	{#each pipelineOrder as discipline, index (discipline)}
		<button
			type="button"
			class="pipeline-step"
			class:current={discipline === current}
			onclick={() => goToSection(discipline)}
		>
			{disciplineLabels[discipline]}
		</button>
		{#if index < pipelineOrder.length - 1}
			<span class="pipeline-arrow" aria-hidden="true">&rsaquo;</span>
		{/if}
	{/each}
</div>

<style>
	.small-heading {
		margin: 8px 0 2px;
		font: 10px var(--mono);
		color: var(--dim);
		text-transform: uppercase;
	}

	.pipeline {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px;
		margin: 6px 0 10px;
	}

	.pipeline-step {
		padding: 4px 10px;
		background: none;
		border: 1px solid var(--cyan);
		color: var(--line);
		font: 12px var(--mono);
		cursor: pointer;
	}

	.pipeline-step:hover,
	.pipeline-step:focus-visible,
	.pipeline-step.current {
		background: var(--cyan);
		color: var(--bg);
		outline: none;
	}

	.pipeline-arrow {
		color: var(--amber);
	}
</style>
