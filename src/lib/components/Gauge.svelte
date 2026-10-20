<script lang="ts" module>
	/** A half circle, drawn left to right. `pathLength="100"` lets us fill it by percentage. */
	const GAUGE_ARC_PATH = 'M10 52A40 40 0 0 1 90 52';
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		/** How much of the arc to fill, 0 to 100. */
		percent: number;
		/** Text shown inside the dial, for example "+25%". */
		displayValue: string;
		/** Caption under the dial. */
		label: string;
	}

	let { percent, displayValue, label }: Props = $props();

	const targetPercent = $derived(Math.min(100, Math.max(0, percent)));

	// Starts empty and fills after the component appears, so the dial sweeps up once.
	let filledPercent = $state(0);

	onMount(() => {
		const animationFrameId = requestAnimationFrame(() => {
			filledPercent = targetPercent;
		});
		return () => cancelAnimationFrame(animationFrameId);
	});
</script>

<figure class="gauge">
	<svg viewBox="0 0 100 62" role="img" aria-label="{label}: {displayValue}">
		<path class="gauge-track" d={GAUGE_ARC_PATH} pathLength="100" />
		<path
			class="gauge-fill"
			d={GAUGE_ARC_PATH}
			pathLength="100"
			stroke-dasharray="{filledPercent} 100"
		/>
		<text x="50" y="46" text-anchor="middle">{displayValue}</text>
	</svg>
	<figcaption class="gauge-label">{label}</figcaption>
</figure>

<style>
	.gauge {
		flex: 1;
		min-width: 0;
		margin: 0;
		padding: 6px 2px;
		text-align: center;
		border: 1px solid var(--grid);
		background: rgba(95, 212, 255, 0.05);
	}

	svg {
		width: 100%;
		max-width: 110px;
	}

	.gauge-track,
	.gauge-fill {
		fill: none;
		stroke-width: 7;
	}

	.gauge-track {
		stroke: var(--grid);
	}

	.gauge-fill {
		stroke: var(--amber);
		transition: stroke-dasharray 0.9s cubic-bezier(0.5, 0, 0.2, 1);
		transition-delay: calc(var(--reveal-start, 0s) + 0.6s);
	}

	text {
		font: 600 17px var(--mono);
		fill: var(--line);
	}

	.gauge-label {
		font: 11px/1.3 var(--mono);
		color: var(--dim);
	}

	@media (max-width: 520px) {
		text {
			font-size: 15px;
		}
	}
</style>
