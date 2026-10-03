<script lang="ts">
	import type { ArchitectureNode } from '#lib/data/sections.js';

	interface Props {
		nodes: ArchitectureNode[];
	}

	let { nodes }: Props = $props();

	let selectedNodeId = $state<string | null>(null);

	const requestPathNodes = $derived(nodes.filter((node) => node.lane === 'request-path'));
	const supportingNodes = $derived(nodes.filter((node) => node.lane === 'supporting'));
	const selectedNode = $derived(nodes.find((node) => node.id === selectedNodeId));
</script>

{#snippet nodeButton(node: ArchitectureNode)}
	<button
		type="button"
		class="node-button"
		class:selected={node.id === selectedNodeId}
		aria-pressed={node.id === selectedNodeId}
		onclick={() => (selectedNodeId = node.id)}
	>
		{node.label}
	</button>
{/snippet}

<div class="schematic">
	<ol class="lane lane--request-path" aria-label="Request path">
		{#each requestPathNodes as node (node.id)}
			<li>{@render nodeButton(node)}</li>
		{/each}
	</ol>

	<ul class="lane lane--supporting" aria-label="Supporting services">
		{#each supportingNodes as node (node.id)}
			<li>{@render nodeButton(node)}</li>
		{/each}
	</ul>

	<p class="node-explanation" aria-live="polite">
		{selectedNode ? selectedNode.explanation : 'Tap a node to see the design decision behind it.'}
	</p>
</div>

<style>
	.lane {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px;
		margin: 8px 0;
		padding: 0;
		list-style: none;
	}

	.lane--request-path li {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	/* Arrow after every node in the request path except the last. */
	.lane--request-path li:not(:last-child)::after {
		content: '\203A';
		color: var(--amber);
	}

	.node-button {
		padding: 4px 10px;
		background: none;
		border: 1px solid var(--cyan);
		color: var(--line);
		font: 12px var(--mono);
		cursor: pointer;
	}

	.node-button:hover,
	.node-button:focus-visible,
	.node-button.selected {
		background: var(--cyan);
		color: var(--bg);
		outline: none;
	}

	.node-explanation {
		min-height: 3em;
		margin: 6px 0 0;
		font: 12px/1.5 var(--mono);
		color: var(--dim);
	}
</style>
