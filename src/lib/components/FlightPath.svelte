<script lang="ts">
	import type { SectionId } from '#lib/data/sections.js';

	interface Waypoint {
		id: SectionId;
		label: string;
		title: string;
	}

	interface Props {
		waypoints: Waypoint[];
		activeIndex: number;
		onSelectWaypoint: (sectionId: SectionId) => void;
		departureCode: string;
		arrivalCode: string;
	}

	let { waypoints, activeIndex, onSelectWaypoint, departureCode, arrivalCode }: Props = $props();

	const lastIndex = $derived(waypoints.length - 1);
	const positionPercent = (index: number) => (lastIndex <= 0 ? 0 : (index / lastIndex) * 100);
	const progressPercent = $derived(positionPercent(activeIndex));
</script>

<nav class="route-bar" aria-label="Flight path">
	<span class="airport">{departureCode}</span>

	<div class="route">
		<div class="route-line"></div>
		<div class="route-flown" style:width="{progressPercent}%"></div>

		<ol class="waypoints">
			{#each waypoints as waypoint, index (waypoint.id)}
				<li style:left="{positionPercent(index)}%">
					<button
						type="button"
						class="waypoint"
						class:passed={index < activeIndex}
						class:active={index === activeIndex}
						aria-current={index === activeIndex ? 'step' : undefined}
						aria-label="{waypoint.title}, waypoint {index + 1} of {waypoints.length}"
						title={waypoint.title}
						onclick={() => onSelectWaypoint(waypoint.id)}
					>
						<span class="waypoint-dot"></span>
						<span class="waypoint-label">{waypoint.label}</span>
					</button>
				</li>
			{/each}
		</ol>

		<svg class="route-plane" style:left="{progressPercent}%" viewBox="0 0 24 24" aria-hidden="true">
			<path d="M24 12L16 9L12 1L9 1L11 9L3 9L1 5L0 5L1 12L0 19L1 19L3 15L11 15L9 23L12 23L16 15Z" />
		</svg>
	</div>

	<span class="airport">{arrivalCode}</span>
</nav>

<style>
	.route-bar {
		display: flex;
		align-items: stretch;
		gap: 10px;
		height: var(--route-bar-height);
		padding: 0 16px;
		background: var(--panel);
		border-bottom: 1px solid var(--line);
	}

	.airport {
		align-self: flex-start;
		margin-top: 18px;
		font: 600 13px var(--mono);
		color: var(--cyan);
	}

	.route {
		position: relative;
		flex: 1;
		margin: 0 14px;
	}

	/* The line is drawn at 27px so the dots and the plane can sit on it. */
	.route-line,
	.route-flown {
		position: absolute;
		top: 26px;
		left: 0;
		height: 0;
	}

	.route-line {
		right: 0;
		border-top: 2px dashed var(--grid);
	}

	.route-flown {
		border-top: 2px solid var(--amber);
		transition: width 0.8s cubic-bezier(0.5, 0, 0.2, 1);
	}

	.waypoints {
		position: absolute;
		inset: 0;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.waypoints li {
		position: absolute;
		top: 0;
		bottom: 0;
		transform: translateX(-50%);
	}

	.waypoint {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
		min-width: 24px;
		padding: 21px 2px 4px;
		background: none;
		border: 0;
		color: var(--dim);
		font: 11px var(--mono);
		cursor: pointer;
	}

	.waypoint-dot {
		width: 12px;
		height: 12px;
		border: 2px solid var(--line);
		border-radius: 50%;
		background: var(--bg);
		transition:
			background 0.3s,
			border-color 0.3s,
			transform 0.3s;
	}

	.waypoint.passed .waypoint-dot {
		background: var(--amber);
		border-color: var(--amber);
	}

	.waypoint.active .waypoint-dot {
		background: var(--amber);
		border-color: var(--amber);
		transform: scale(1.35);
	}

	.waypoint:hover .waypoint-dot {
		border-color: var(--cyan);
	}

	.waypoint:focus-visible {
		outline: 2px solid var(--cyan);
		outline-offset: -2px;
	}

	.waypoint-label {
		display: none;
		margin-top: 6px;
		white-space: nowrap;
	}

	.waypoint.active .waypoint-label {
		display: block;
		color: var(--amber);
	}

	.route-plane {
		position: absolute;
		top: 2px;
		width: 22px;
		height: 22px;
		fill: var(--amber);
		transform: translateX(-50%);
		transition: left 0.8s cubic-bezier(0.5, 0, 0.2, 1);
		pointer-events: none;
	}

	/* On wide screens every waypoint shows its name. */
	@media (min-width: 1280px) {
		.waypoint-label {
			display: block;
		}
	}

	@media (max-width: 520px) {
		.route-bar {
			padding: 0 8px;
		}
		.airport {
			display: none;
		}
		.route {
			margin: 0 12px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.route-flown,
		.route-plane,
		.waypoint-dot {
			transition: none;
		}
	}
</style>
