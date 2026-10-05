<script lang="ts">
	import type { RequestHop } from '#lib/data/sections.js';

	interface Props {
		hops: RequestHop[];
	}

	let { hops }: Props = $props();

	const totalMs = $derived(hops.reduce((total, hop) => total + hop.durationMs, 0));
</script>

<p>A request is a flight with waypoints. Time spent at each one:</p>

{#each hops as hop (hop.name)}
	<div class="hop-row">
		<span>{hop.name}</span>
		<div class="hop-bar" style:width="{(hop.durationMs / totalMs) * 100}%"></div>
		<span class="hop-duration">{hop.durationMs} ms</span>
	</div>
{/each}

<p class="meta-text">Total {totalMs} ms</p>

<style>
	.hop-row {
		display: grid;
		grid-template-columns: 130px 1fr 54px;
		align-items: center;
		gap: 8px;
		margin: 5px 0;
		font: 12px var(--mono);
	}

	.hop-bar {
		height: 8px;
		background: var(--amber);
	}

	.hop-duration {
		color: var(--dim);
		text-align: right;
	}

	@media (max-width: 520px) {
		.hop-row {
			grid-template-columns: 96px 1fr 48px;
		}
	}
</style>
