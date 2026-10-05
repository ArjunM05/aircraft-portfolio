<script lang="ts" module>
	import type { FlightPhase } from '#lib/portfolio-state.svelte.js';

	const ALTIMETER_MAX_FEET = 40_000;
	const DIAL_START_DEGREES = -135;
	const DIAL_SWEEP_DEGREES = 270;
	const DIAL_CENTER = 50;

	/** A point on a dial: angle 0 is straight up, increasing clockwise. */
	function pointOnDial(angleDegrees: number, radius: number) {
		const radians = (angleDegrees * Math.PI) / 180;
		return {
			x: DIAL_CENTER + radius * Math.sin(radians),
			y: DIAL_CENTER - radius * Math.cos(radians)
		};
	}

	/** Altimeter ticks every 2,000 ft, numbered every 10,000 ft. */
	const altimeterTicks = Array.from({ length: 21 }, (_, step) => {
		const feet = step * 2000;
		const angle = DIAL_START_DEGREES + (feet / ALTIMETER_MAX_FEET) * DIAL_SWEEP_DEGREES;
		const isMajor = feet % 10_000 === 0;

		return {
			feet,
			isMajor,
			from: pointOnDial(angle, isMajor ? 34 : 38),
			to: pointOnDial(angle, 43),
			labelPosition: pointOnDial(angle, 26)
		};
	});

	/** Compass ticks every 10 degrees, longer every 30. */
	const compassTicks = Array.from({ length: 36 }, (_, step) => ({
		angle: step * 10,
		isMajor: (step * 10) % 30 === 0
	}));

	const cardinalPoints = [
		{ letter: 'N', angle: 0 },
		{ letter: 'E', angle: 90 },
		{ letter: 'S', angle: 180 },
		{ letter: 'W', angle: 270 }
	];

	const formatHeading = (degrees: number) => String(degrees).padStart(3, '0');
</script>

<script lang="ts">
	interface Props {
		altitudeFeet: number;
		headingDegrees: number;
		phase: FlightPhase;
	}

	let { altitudeFeet, headingDegrees, phase }: Props = $props();

	const needleAngle = $derived(
		DIAL_START_DEGREES +
			(Math.min(altitudeFeet, ALTIMETER_MAX_FEET) / ALTIMETER_MAX_FEET) * DIAL_SWEEP_DEGREES
	);
</script>

<div class="instrument-cluster">
	<p class="phase">{phase}</p>

	<div class="dials">
		<figure class="instrument">
			<svg viewBox="0 0 100 100" role="img" aria-label="Altimeter: {altitudeFeet} feet">
				<circle class="dial-face" cx="50" cy="50" r="46" />

				{#each altimeterTicks as tick (tick.feet)}
					<line
						class="tick"
						class:major={tick.isMajor}
						x1={tick.from.x}
						y1={tick.from.y}
						x2={tick.to.x}
						y2={tick.to.y}
					/>
					{#if tick.isMajor}
						<text
							class="dial-label"
							x={tick.labelPosition.x}
							y={tick.labelPosition.y + 2.5}
							text-anchor="middle"
						>
							{tick.feet / 1000}
						</text>
					{/if}
				{/each}

				<g class="moving-part" style:transform="rotate({needleAngle}deg)">
					<line class="needle" x1="50" y1="54" x2="50" y2="20" />
				</g>
				<circle class="hub" cx="50" cy="50" r="3.5" />
			</svg>
			<figcaption>ALT {altitudeFeet.toLocaleString('en-US')} FT</figcaption>
		</figure>

		<figure class="instrument">
			<svg
				viewBox="0 0 100 100"
				role="img"
				aria-label="Heading: {formatHeading(headingDegrees)} degrees"
			>
				<circle class="dial-face" cx="50" cy="50" r="46" />

				<!-- The compass card turns opposite to the heading, like a real heading indicator. -->
				<g class="moving-part" style:transform="rotate({-headingDegrees}deg)">
					{#each compassTicks as tick (tick.angle)}
						<line
							class="tick"
							class:major={tick.isMajor}
							x1="50"
							y1="6"
							x2="50"
							y2={tick.isMajor ? 13 : 10}
							transform="rotate({tick.angle} 50 50)"
						/>
					{/each}
					{#each cardinalPoints as point (point.letter)}
						<text
							class="dial-label cardinal"
							x="50"
							y="25"
							text-anchor="middle"
							transform="rotate({point.angle} 50 50)"
						>
							{point.letter}
						</text>
					{/each}
				</g>

				<path class="lubber-mark" d="M50 3L46 11L54 11Z" />
				<path
					class="aircraft-symbol"
					d="M50 38L52 47L63 54L63 57L52 54L51 62L55 65L55 67L50 66L45 67L45 65L49 62L48 54L37 57L37 54L48 47Z"
				/>
			</svg>
			<figcaption>HDG {formatHeading(headingDegrees)}&deg;</figcaption>
		</figure>
	</div>
</div>

<style>
	.instrument-cluster {
		padding: 8px 10px 6px;
		background: var(--panel);
		border: 1px solid var(--line);
	}

	.phase {
		margin: 0 0 4px;
		font: 11px var(--mono);
		color: var(--amber);
		text-transform: uppercase;
	}

	.dials {
		display: flex;
		gap: 10px;
	}

	.instrument {
		margin: 0;
		text-align: center;
	}

	svg {
		display: block;
		width: 92px;
		height: 92px;
	}

	figcaption {
		margin-top: 2px;
		font: 11px var(--mono);
		color: var(--dim);
	}

	.dial-face {
		fill: #05182f;
		stroke: var(--line);
		stroke-width: 1.5;
	}

	.tick {
		stroke: var(--dim);
		stroke-width: 0.8;
	}

	.tick.major {
		stroke: var(--line);
		stroke-width: 1.4;
	}

	.dial-label {
		font: 7px var(--mono);
		fill: var(--line);
	}

	.cardinal {
		font-size: 9px;
		fill: var(--cyan);
	}

	.moving-part {
		transform-origin: 50px 50px;
		transition: transform 0.9s cubic-bezier(0.5, 0, 0.2, 1);
	}

	.needle {
		stroke: var(--amber);
		stroke-width: 2.4;
		stroke-linecap: round;
	}

	.hub {
		fill: var(--amber);
	}

	.lubber-mark {
		fill: var(--amber);
	}

	.aircraft-symbol {
		fill: var(--line);
	}

	@media (prefers-reduced-motion: reduce) {
		.moving-part {
			transition: none;
		}
	}
</style>
