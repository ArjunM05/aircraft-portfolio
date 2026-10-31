<script lang="ts">
	import { untrack } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import { buildCameraTransform, viewFrameFor } from '#lib/blueprint/camera-math.js';
	import {
		AIRCRAFT_CENTER,
		aircraftParts,
		getPartDisplayName,
		partMarkerPositions,
		VIEWBOX_HEIGHT,
		VIEWBOX_WIDTH,
		type AircraftPartDefinition,
		type BlueprintOrientation,
		type PartShape
	} from '#lib/blueprint/geometry.js';
	import {
		RADAR_RING_INDEXES,
		RADAR_RING_RADIUS,
		RADAR_SWEEP_SECONDS_PER_TURN,
		radarSweepSlices
	} from '#lib/blueprint/radar.js';
	import { SmoothCamera } from '#lib/blueprint/smooth-camera.svelte.js';
	import type { AircraftPartId, CameraTarget } from '#lib/blueprint/types.js';

	interface Props {
		/** The part that is currently highlighted. */
		activePart: AircraftPartId;
		/** Where the camera should end up. The component glides towards it. */
		camera: CameraTarget;
		/** Called when a visitor clicks a part, or presses Enter/Space on it. */
		onSelectPart: (part: AircraftPartId) => void;
		/** Parts that have a section behind them. The others are drawn but cannot be clicked. */
		interactiveParts: AircraftPartId[];
		/** Short caption per part, shown in the hover label (for example "Skills"). */
		partCaptions: Partial<Record<AircraftPartId, string>>;
		/** 'horizontal' turns the aircraft sideways, filling the short, wide strip on phones. */
		orientation?: BlueprintOrientation;
		/** Radar rings and sweep behind the aircraft. */
		showRadar?: boolean;
	}

	let {
		activePart,
		camera,
		onSelectPart,
		interactiveParts,
		partCaptions,
		orientation = 'vertical',
		showRadar = false
	}: Props = $props();

	const prefersReducedMotion = new MediaQuery('prefers-reduced-motion: reduce', false);

	// untrack: only the first value is wanted here. The effect below follows later changes.
	const smoothCamera = new SmoothCamera(untrack(() => camera));

	$effect(() => {
		const target = { ...camera };
		// Returning moveTo's result cancels the running animation before the next one starts.
		return smoothCamera.moveTo(target, { snap: prefersReducedMotion.current });
	});

	const viewFrame = $derived(viewFrameFor(orientation));
	const cameraTransform = $derived(buildCameraTransform(smoothCamera.current, viewFrame));

	let hoveredPart = $state<AircraftPartId | null>(null);

	const hoverCaption = $derived(
		hoveredPart ? `${getPartDisplayName(hoveredPart)}: ${partCaptions[hoveredPart] ?? ''}` : ''
	);

	/** Keeps markers about the same size on screen whatever the zoom is. */
	const markerRadius = $derived(5 / smoothCamera.current.zoom);

	function handlePartKeydown(event: KeyboardEvent, part: AircraftPartId) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onSelectPart(part);
		}
	}
</script>

<div class="blueprint-frame">
	<svg
		class="blueprint"
		viewBox="0 0 {viewFrame.width} {viewFrame.height}"
		preserveAspectRatio="xMidYMid meet"
		role="group"
		aria-label="Top-down blueprint of an Airbus A350-900. Each part opens a section."
	>
		<!-- These snippets live inside the <svg>, so Svelte knows their elements are SVG. -->
		{#snippet shapeElement(shape: PartShape)}
			{#if shape.element === 'path'}
				<path class="shape shape--{shape.role}" {...shape.attributes} />
			{:else if shape.element === 'rect'}
				<rect class="shape shape--{shape.role}" {...shape.attributes} />
			{:else}
				<circle class="shape shape--{shape.role}" {...shape.attributes} />
			{/if}
		{/snippet}

		{#snippet partShapes(part: AircraftPartDefinition)}
			{#each part.shapes as shape}
				{@render shapeElement(shape)}
				{#if shape.mirrored}
					<g transform="translate({VIEWBOX_WIDTH} 0) scale(-1 1)">
						{@render shapeElement(shape)}
					</g>
				{/if}
			{/each}
		{/snippet}

		{#snippet radar()}
			<g aria-hidden="true">
				{#if !prefersReducedMotion.current}
					<g>
						<animateTransform
							attributeName="transform"
							type="rotate"
							from="0 {AIRCRAFT_CENTER.x} {AIRCRAFT_CENTER.y}"
							to="360 {AIRCRAFT_CENTER.x} {AIRCRAFT_CENTER.y}"
							dur="{RADAR_SWEEP_SECONDS_PER_TURN}s"
							repeatCount="indefinite"
						/>
						{#each radarSweepSlices as slice, index (index)}
							<path class="radar-slice" d={slice.path} fill-opacity={slice.opacity} />
						{/each}
					</g>
				{/if}

				{#each RADAR_RING_INDEXES as ringIndex (ringIndex)}
					<circle
						class="radar-ring"
						cx={AIRCRAFT_CENTER.x}
						cy={AIRCRAFT_CENTER.y}
						r={RADAR_RING_RADIUS}
						style:--ring-index={ringIndex}
					/>
				{/each}
			</g>
		{/snippet}

		<g transform={cameraTransform}>
			{#if showRadar}{@render radar()}{/if}

			<path class="center-line" d="M200 0V640" />

			{#each aircraftParts as part, partIndex (part.id)}
				{#if interactiveParts.includes(part.id)}
					<g
						class="aircraft-part"
						class:active={part.id === activePart}
						style:--part-index={partIndex}
						role="button"
						tabindex="0"
						aria-label={part.displayName}
						aria-pressed={part.id === activePart}
						onclick={() => onSelectPart(part.id)}
						onkeydown={(event) => handlePartKeydown(event, part.id)}
						onpointerenter={() => (hoveredPart = part.id)}
						onpointerleave={() => (hoveredPart = null)}
						onfocus={() => (hoveredPart = part.id)}
						onblur={() => (hoveredPart = null)}
					>
						{@render partShapes(part)}
					</g>
				{:else}
					<!-- Drawn so the aircraft keeps its full shape, but nothing happens when it is clicked. -->
					<g class="aircraft-part inert" style:--part-index={partIndex} aria-hidden="true">
						{@render partShapes(part)}
					</g>
				{/if}
			{/each}

			{#each aircraftParts as part (part.id)}
				{#if interactiveParts.includes(part.id) && part.id !== activePart}
					{@const marker = partMarkerPositions[part.id]}
					<g class="hotspot" transform="translate({marker.x} {marker.y})" aria-hidden="true">
						<circle class="hotspot-pulse" r={markerRadius * 2.2} />
						<circle class="hotspot-dot" r={markerRadius} />
					</g>
				{/if}
			{/each}
		</g>
	</svg>

	<div class="scan-line" aria-hidden="true"></div>

	{#if hoverCaption}
		<p class="part-caption" aria-hidden="true">{hoverCaption}</p>
	{/if}
</div>

<style>
	.blueprint-frame {
		position: relative;
		width: 100%;
		height: 100%;
		min-height: 0;
	}

	.blueprint {
		display: block;
		width: 100%;
		height: 100%;
		min-height: 0;
		touch-action: pan-y;
	}

	.center-line {
		fill: none;
		stroke: var(--cyan);
		stroke-width: 0.5;
		stroke-dasharray: 6 3 1 3;
		pointer-events: none;
		vector-effect: non-scaling-stroke;
	}

	.aircraft-part {
		fill: rgba(95, 212, 255, 0.06);
		stroke: var(--line);
		stroke-width: 1.5;
		cursor: pointer;
		transition:
			fill 0.3s,
			stroke 0.3s;
		/* Each part fades in with a brief cyan outline, as if being drawn. */
		animation: draft-in 0.7s ease-out backwards;
		animation-delay: calc(var(--reveal-start, 0s) + var(--part-index, 0) * 90ms);
	}

	.aircraft-part:hover {
		fill: rgba(95, 212, 255, 0.26);
	}

	.aircraft-part:focus-visible {
		fill: rgba(95, 212, 255, 0.26);
		stroke: var(--cyan);
		stroke-width: 2.5;
		outline: none;
	}

	.aircraft-part.active {
		fill: rgba(255, 180, 84, 0.3);
		stroke: var(--amber);
	}

	.aircraft-part.inert {
		cursor: default;
		pointer-events: none;
		fill: rgba(95, 212, 255, 0.03);
	}

	@keyframes draft-in {
		from {
			opacity: 0;
			stroke: var(--cyan);
		}
	}

	/* Keep outlines the same thickness at every zoom level. */
	.shape {
		vector-effect: non-scaling-stroke;
	}

	.shape--detail {
		fill: rgba(217, 236, 255, 0.55);
		stroke: none;
	}

	.shape--hit-area {
		fill: transparent;
		stroke: none;
	}

	.part-caption {
		position: absolute;
		bottom: 14px;
		left: 50%;
		transform: translateX(-50%);
		margin: 0;
		padding: 4px 12px;
		background: var(--panel);
		border: 1px solid var(--amber);
		color: var(--amber);
		font: 12px var(--mono);
		white-space: nowrap;
		pointer-events: none;
	}

	/* ---------- markers ---------- */
	.hotspot {
		pointer-events: none;
		/* Markers appear once the drawing is done. */
		animation: hotspot-in 0.5s ease-out backwards;
		animation-delay: calc(var(--reveal-start, 0s) + 1.5s);
	}

	@keyframes hotspot-in {
		from {
			opacity: 0;
		}
	}

	.hotspot-dot {
		fill: var(--amber);
	}

	.hotspot-pulse {
		fill: none;
		stroke: var(--amber);
		stroke-width: 1.5;
		vector-effect: non-scaling-stroke;
		transform-box: fill-box;
		transform-origin: center;
		animation: hotspot-pulse 2s ease-out infinite;
	}

	@keyframes hotspot-pulse {
		from {
			opacity: 0.9;
			transform: scale(0.4);
		}
		to {
			opacity: 0;
			transform: scale(1.4);
		}
	}

	/* ---------- scan line ---------- */
	/* A scan line sweeps from nose to tail while the drawing appears. */
	.scan-line {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		opacity: 0;
		pointer-events: none;
		background: linear-gradient(90deg, transparent, var(--cyan), transparent);
		box-shadow: 0 0 14px var(--cyan);
		animation: scan-down 1.6s ease-in-out backwards;
		animation-delay: var(--reveal-start, 0s);
	}

	@keyframes scan-down {
		0% {
			top: 0;
			opacity: 0;
		}
		10%,
		90% {
			opacity: 0.9;
		}
		100% {
			top: 100%;
			opacity: 0;
		}
	}

	/* ---------- radar ---------- */
	.radar-slice {
		fill: var(--cyan);
	}

	.radar-ring {
		fill: none;
		stroke: var(--cyan);
		stroke-width: 1;
		vector-effect: non-scaling-stroke;
		opacity: 0;
		transform-box: fill-box;
		transform-origin: center;
		animation: radar-ping 7s ease-out infinite;
		animation-delay: calc(var(--ring-index) * 2.3s);
	}

	@keyframes radar-ping {
		from {
			opacity: 0.3;
			transform: scale(0.15);
		}
		to {
			opacity: 0;
			transform: scale(1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hotspot-pulse {
			animation: none;
			opacity: 0.5;
		}

		.radar-ring {
			animation: none;
			opacity: 0.1;
			transform: scale(0.6);
		}
	}
</style>
