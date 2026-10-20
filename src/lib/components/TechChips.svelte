<script lang="ts">
	interface Props {
		technologies: string[];
		/** How many chips to show before collapsing the rest into "+N". */
		limit?: number;
	}

	let { technologies, limit = 4 }: Props = $props();

	const shownTechnologies = $derived(technologies.slice(0, limit));
	const hiddenCount = $derived(Math.max(0, technologies.length - limit));
</script>

{#if technologies.length > 0}
	<span class="tech-chips">
		{#each shownTechnologies as technology (technology)}
			<span class="tech-chip">{technology}</span>
		{/each}
		{#if hiddenCount > 0}
			<span class="tech-chip tech-chip--more">+{hiddenCount}</span>
		{/if}
	</span>
{/if}

<style>
	.tech-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
	}

	.tech-chip {
		padding: 1px 7px;
		border: 1px solid var(--grid);
		font: 11px var(--mono);
		color: var(--dim);
	}

	.tech-chip--more {
		border-style: dashed;
	}
</style>
