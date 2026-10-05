<script lang="ts">
	import type { TelemetryBar } from '#lib/data/sections.js';

	interface Props {
		bars: TelemetryBar[];
	}

	let { bars }: Props = $props();
</script>

{#each bars as bar (bar.label)}
	<div class="telemetry-row">
		<span class="telemetry-label">{bar.label}</span>
		<div class="telemetry-bar" style:width="{bar.barPercent}%"></div>
		<span class="telemetry-value">{bar.displayValue}</span>
	</div>
{/each}

<style>
	.telemetry-row {
		display: grid;
		grid-template-columns: 1fr 70px;
		gap: 2px 8px;
		margin: 8px 0;
		font: 12px var(--mono);
	}

	.telemetry-label {
		grid-column: 1 / -1;
		color: var(--dim);
	}

	.telemetry-bar {
		height: 8px;
		align-self: center;
		background: var(--cyan);
	}

	.telemetry-value {
		text-align: right;
	}
</style>
