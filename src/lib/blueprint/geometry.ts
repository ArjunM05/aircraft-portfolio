import type { AircraftPartId } from './types.js';

/** How a shape is drawn: normal outline, small decoration, or an invisible bigger click target. */
export type ShapeRole = 'outline' | 'detail' | 'hit-area';

export interface PartShape {
	element: 'path' | 'rect' | 'circle';
	attributes: Record<string, string | number>;
	role: ShapeRole;
	/** Also draw a flipped copy on the left side of the aircraft. */
	mirrored?: boolean;
}

export interface AircraftPartDefinition {
	id: AircraftPartId;
	displayName: string;
	shapes: PartShape[];
}

/** 'horizontal' turns the aircraft sideways (nose on the left), filling the short, wide phone strip. */
export type BlueprintOrientation = 'vertical' | 'horizontal';

/** The drawing is 400 x 640 units, nose pointing up, centred on x = 200. */
export const VIEWBOX_WIDTH = 400;
export const VIEWBOX_HEIGHT = 640;

/** The middle of the aircraft in the drawing. The radar is centred on it. */
export const AIRCRAFT_CENTER = { x: 200, y: 306 } as const;

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
export const aircraftParts: AircraftPartDefinition[] = [
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

/** Where each part's pulsing marker sits, in the 400 x 640 drawing. */
export const partMarkerPositions: Record<AircraftPartId, { x: number; y: number }> = {
	cockpit: { x: 200, y: 24 },
	fuselage: { x: 200, y: 300 },
	'avionics-bay': { x: 200, y: 111 },
	'passenger-cabin': { x: 200, y: 198 },
	engines: { x: 290, y: 284 },
	wings: { x: 245, y: 255 },
	flaps: { x: 272, y: 318 },
	winglets: { x: 394, y: 340 },
	ailerons: { x: 352, y: 347 },
	'cargo-hold': { x: 200, y: 411 },
	'black-box': { x: 200, y: 477 },
	elevators: { x: 260, y: 530 },
	rudder: { x: 200, y: 541 }
};

export function getPartDisplayName(partId: AircraftPartId): string {
	return aircraftParts.find((part) => part.id === partId)?.displayName ?? partId;
}
