<script lang="ts" module>
	import type { AircraftPartId, CameraTarget } from '#lib/data/sections.js';

	/** How a shape is drawn: normal outline, small decoration, or an invisible bigger click target. */
	type ShapeRole = 'outline' | 'detail' | 'hit-area';

	interface PartShape {
		element: 'path' | 'rect' | 'circle';
		attributes: Record<string, string | number>;
		role: ShapeRole;
		/** Also draw a flipped copy on the left side of the aircraft. */
		mirrored?: boolean;
	}

	interface AircraftPartDefinition {
		id: AircraftPartId;
		displayName: string;
		shapes: PartShape[];
	}

	/** The drawing is 400 x 640 units, nose pointing up, centred on x = 200. */
	const VIEWBOX_WIDTH = 400;
	const VIEWBOX_HEIGHT = 640;
	const AIRCRAFT_CENTER_X = VIEWBOX_WIDTH / 2;
	const VIEWBOX_CENTER_Y = VIEWBOX_HEIGHT / 2;

	/** Camera easing: share of the remaining distance covered each frame. */
	const CAMERA_SMOOTHING_PER_FRAME = 0.14;
	const CAMERA_SETTLE_THRESHOLD = 0.05;
	/** Zoom differences are small numbers, so they are weighted up when checking "are we there yet". */
	const ZOOM_DISTANCE_WEIGHT = 50;

	const cabinWindows: PartShape[] = [166, 178, 190, 202, 214, 226].flatMap((rowY) => [
		{ element: 'rect', role: 'detail', attributes: { x: 191, y: rowY, width: 4, height: 5 } },
		{ element: 'rect', role: 'detail', attributes: { x: 205, y: rowY, width: 4, height: 5 } }
	]);

	const avionicsPanels: PartShape[] = [84, 96, 108].map((panelY) => ({
		element: 'rect',
		role: 'detail',
		attributes: { x: 192, y: panelY, width: 16, height: 3 }
	}));

	/**
	 * Parts in drawing order: later parts are painted on top of earlier ones,
	 * so the fuselage comes first and small overlays (cabin, cockpit, rudder) come last.
	 */
	const aircraftParts: AircraftPartDefinition[] = [
		{
			id: 'fuselage',
			displayName: 'Fuselage',
			shapes: [
				{
					element: 'path',
					role: 'outline',
					attributes: {
						d: 'M200 12C214 12 220 50 220 100L220 450C220 500 208 580 200 600C192 580 180 500 180 450L180 100C180 50 186 12 200 12Z'
					}
				}
			]
		},
		{
			id: 'wings',
			displayName: 'Wings',
			shapes: [
				{
					element: 'path',
					role: 'outline',
					mirrored: true,
					attributes: { d: 'M220 200L392 345L392 362L384 364L220 305Z' }
				}
			]
		},
		{
			id: 'elevators',
			displayName: 'Elevators',
			shapes: [
				{
					element: 'path',
					role: 'outline',
					mirrored: true,
					attributes: { d: 'M220 500L300 545L300 556L294 558L220 535Z' }
				}
			]
		},
		{
			id: 'flaps',
			displayName: 'Flaps',
			shapes: [
				{
					element: 'path',
					role: 'outline',
					mirrored: true,
					attributes: { d: 'M232 309L310 337L310 326L234 298Z' }
				}
			]
		},
		{
			id: 'ailerons',
			displayName: 'Ailerons',
			shapes: [
				{
					element: 'path',
					role: 'outline',
					mirrored: true,
					attributes: { d: 'M320 341L384 364L384 352L322 330Z' }
				}
			]
		},
		{
			id: 'winglets',
			displayName: 'Winglets',
			shapes: [
				{
					element: 'rect',
					role: 'hit-area',
					mirrored: true,
					attributes: { x: 383, y: 322, width: 17, height: 48 }
				},
				{
					element: 'path',
					role: 'outline',
					mirrored: true,
					attributes: { d: 'M388 347L397 329L399 335L392 362Z' }
				}
			]
		},
		{
			id: 'engines',
			displayName: 'Engines',
			shapes: [
				{
					element: 'rect',
					role: 'outline',
					mirrored: true,
					attributes: { x: 281, y: 262, width: 18, height: 44, rx: 9 }
				}
			]
		},
		{
			id: 'cargo-hold',
			displayName: 'Cargo hold',
			shapes: [
				{
					element: 'rect',
					role: 'outline',
					attributes: { x: 187, y: 372, width: 26, height: 78, rx: 3, 'stroke-dasharray': '4 2' }
				}
			]
		},
		{
			id: 'avionics-bay',
			displayName: 'Avionics bay',
			shapes: [
				{
					element: 'rect',
					role: 'outline',
					attributes: { x: 188, y: 72, width: 24, height: 78, rx: 3, 'stroke-dasharray': '2 2' }
				},
				...avionicsPanels
			]
		},
		{
			id: 'passenger-cabin',
			displayName: 'Passenger cabin',
			shapes: [
				{
					element: 'rect',
					role: 'outline',
					attributes: { x: 188, y: 158, width: 24, height: 80, rx: 3, 'stroke-dasharray': '2 2' }
				},
				...cabinWindows
			]
		},
		{
			id: 'black-box',
			displayName: 'Black box',
			shapes: [
				{
					element: 'rect',
					role: 'outline',
					attributes: { x: 190, y: 460, width: 20, height: 34, rx: 2 }
				},
				{ element: 'circle', role: 'detail', attributes: { cx: 200, cy: 477, r: 4 } }
			]
		},
		{
			id: 'cockpit',
			displayName: 'Cockpit',
			shapes: [
				{
					element: 'path',
					role: 'outline',
					attributes: { d: 'M200 12C208 12 213 25 215 50L185 50C187 25 192 12 200 12Z' }
				},
				{
					element: 'path',
					role: 'detail',
					attributes: { d: 'M192 42L208 42L206 34L194 34Z' }
				}
			]
		},
		{
			id: 'rudder',
			displayName: 'Rudder',
			shapes: [
				{
					element: 'rect',
					role: 'hit-area',
					attributes: { x: 188, y: 498, width: 24, height: 100 }
				},
				{
					element: 'rect',
					role: 'outline',
					attributes: { x: 197, y: 500, width: 6, height: 82, rx: 3 }
				}
			]
		}
	];
</script>

<script lang="ts">
	import { untrack } from 'svelte';

	interface Props {
		/** The part that is currently highlighted. */
		activePart: AircraftPartId;
		/** Where the camera should end up. The component eases towards it. */
		camera: CameraTarget;
		/** Called when a visitor clicks a part, or presses Enter/Space on it. */
		onSelectPart: (part: AircraftPartId) => void;
		/** Fill the whole frame and crop the edges (good for the short phone layout). */
		cropToFit?: boolean;
		/** Parts that have a section behind them. The others are drawn but cannot be clicked. */
		interactiveParts: AircraftPartId[];
	}

	let { activePart, camera, onSelectPart, interactiveParts, cropToFit = false }: Props = $props();

	// Start exactly where the camera is told to be, so the first paint is already correct.
	// untrack: we intentionally capture only the initial value here; the effect below follows changes.
	let displayedCamera = $state<CameraTarget>(untrack(() => ({ ...camera })));

	const cameraTransform = $derived(
		`translate(${AIRCRAFT_CENTER_X - displayedCamera.centerX * displayedCamera.zoom} ` +
			`${VIEWBOX_CENTER_Y - displayedCamera.centerY * displayedCamera.zoom}) ` +
			`scale(${displayedCamera.zoom})`
	);

	// Ease the displayed camera towards the requested one, one animation frame at a time.
	$effect(() => {
		const target = { ...camera };
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const smoothing = prefersReducedMotion ? 1 : CAMERA_SMOOTHING_PER_FRAME;
		let animationFrameId = 0;

		function moveOneStepTowardsTarget() {
			const nextCamera: CameraTarget = {
				centerX: displayedCamera.centerX + (target.centerX - displayedCamera.centerX) * smoothing,
				centerY: displayedCamera.centerY + (target.centerY - displayedCamera.centerY) * smoothing,
				zoom: displayedCamera.zoom + (target.zoom - displayedCamera.zoom) * smoothing
			};

			const remainingDistance =
				Math.abs(target.centerX - nextCamera.centerX) +
				Math.abs(target.centerY - nextCamera.centerY) +
				Math.abs(target.zoom - nextCamera.zoom) * ZOOM_DISTANCE_WEIGHT;

			if (remainingDistance < CAMERA_SETTLE_THRESHOLD) {
				displayedCamera = target;
				return;
			}

			displayedCamera = nextCamera;
			animationFrameId = requestAnimationFrame(moveOneStepTowardsTarget);
		}

		animationFrameId = requestAnimationFrame(moveOneStepTowardsTarget);

		// Runs before the next effect run and on unmount, so two animations never fight each other.
		return () => cancelAnimationFrame(animationFrameId);
	});

	function handlePartKeydown(event: KeyboardEvent, part: AircraftPartId) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onSelectPart(part);
		}
	}
</script>

<svg
	class="blueprint"
	viewBox="0 0 {VIEWBOX_WIDTH} {VIEWBOX_HEIGHT}"
	preserveAspectRatio={cropToFit ? 'xMidYMid slice' : 'xMidYMid meet'}
	role="group"
	aria-label="Top-down blueprint of an Airbus A350-900. Each part opens a section."
>
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

	<g transform={cameraTransform}>
		<path class="center-line" d="M200 0V640" />

		{#each aircraftParts as part (part.id)}
			{#if interactiveParts.includes(part.id)}
				<g
					class="aircraft-part"
					class:active={part.id === activePart}
					role="button"
					tabindex="0"
					aria-label={part.displayName}
					aria-pressed={part.id === activePart}
					onclick={() => onSelectPart(part.id)}
					onkeydown={(event) => handlePartKeydown(event, part.id)}
				>
					{@render partShapes(part)}
				</g>
			{:else}
				<!-- Drawn so the aircraft keeps its full shape, but nothing happens when it is clicked. -->
				<g class="aircraft-part inert" aria-hidden="true">
					{@render partShapes(part)}
				</g>
			{/if}
		{/each}
	</g>
</svg>

<style>
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
</style>
