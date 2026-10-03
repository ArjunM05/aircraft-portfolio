<script lang="ts">
	interface Props {
		steps: string[];
	}

	let { steps }: Props = $props();
</script>

<ol class="flow-steps">
	{#each steps as step, index (index)}
		<li>{step}</li>
	{/each}
</ol>

<style>
	.flow-steps {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px;
		margin: 8px 0;
		padding: 0;
		list-style: none;
	}

	li {
		display: flex;
		align-items: center;
		gap: 6px;
		border: 1px solid var(--cyan);
		padding: 4px 10px;
		font: 12px var(--mono);
	}

	/* Arrow between steps, drawn after every step except the last. */
	li:not(:last-child)::after {
		content: '\203A';
		position: relative;
		right: -12px;
		margin-left: 4px;
		color: var(--amber);
	}
</style>
