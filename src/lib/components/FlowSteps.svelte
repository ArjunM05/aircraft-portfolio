<script lang="ts">
	interface Props {
		steps: string[];
	}

	let { steps }: Props = $props();
</script>

<ol class="flow-steps">
	{#each steps as step, index (index)}
		<li class="flow-step">
			<span class="step-box">{step}</span>
			{#if index < steps.length - 1}
				<span class="step-arrow" aria-hidden="true">&rsaquo;</span>
			{/if}
		</li>
	{/each}
</ol>

<style>
	.flow-steps {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 4px;
		margin: 8px 0;
		padding: 0;
		list-style: none;
	}

	/* One step = its box plus the arrow that follows it, so they always stay together. */
	.flow-step {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.step-box {
		padding: 4px 10px;
		border: 1px solid var(--cyan);
		font: 12px var(--mono);
		line-height: 1.4;
	}

	.step-arrow {
		color: var(--amber);
		font: 16px var(--mono);
		line-height: 1;
	}

	/* On narrow screens, stack the steps vertically with a downward arrow between them. */
	@media (max-width: 520px) {
		.flow-steps {
			flex-direction: column;
			align-items: flex-start;
			gap: 0;
		}

		.flow-step {
			flex-direction: column;
			align-items: flex-start;
			gap: 0;
		}

		.step-arrow {
			margin: 2px 0 2px 12px;
			transform: rotate(90deg);
			transform-origin: center;
		}
	}
</style>
