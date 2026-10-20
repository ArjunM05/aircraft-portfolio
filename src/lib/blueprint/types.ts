export type AircraftPartId =
	| 'cockpit'
	| 'fuselage'
	| 'flaps'
	| 'winglets'
	| 'passenger-cabin'
	| 'avionics-bay'
	| 'engines'
	| 'wings'
	| 'cargo-hold'
	| 'black-box'
	| 'ailerons'
	| 'elevators'
	| 'rudder';

/** Where the blueprint camera looks. Coordinates are in the 400 x 640 SVG viewBox. */
export interface CameraTarget {
	centerX: number;
	centerY: number;
	zoom: number;
}
