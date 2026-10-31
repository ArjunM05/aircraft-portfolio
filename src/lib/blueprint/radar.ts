import { AIRCRAFT_CENTER } from './geometry.js';

export const RADAR_RING_RADIUS = 330;
export const RADAR_RING_INDEXES = [0, 1, 2];
export const RADAR_SWEEP_SECONDS_PER_TURN = 10;

const RADAR_SWEEP_RADIUS = 300;
const RADAR_SWEEP_SLICE_COUNT = 6;
const RADAR_SWEEP_SLICE_DEGREES = 12;
const RADAR_SWEEP_LEADING_OPACITY = 0.14;

/** Angle 0 points straight up; angles grow clockwise. */
function pointAt(angleDegrees: number) {
	const radians = (angleDegrees * Math.PI) / 180;
	return {
		x: AIRCRAFT_CENTER.x + RADAR_SWEEP_RADIUS * Math.sin(radians),
		y: AIRCRAFT_CENTER.y - RADAR_SWEEP_RADIUS * Math.cos(radians)
	};
}

/** A pie slice of the sweep, from one angle to another. */
export function slicePath(fromDegrees: number, toDegrees: number): string {
	const start = pointAt(fromDegrees);
	const end = pointAt(toDegrees);

	return (
		`M ${AIRCRAFT_CENTER.x} ${AIRCRAFT_CENTER.y} L ${start.x} ${start.y} ` +
		`A ${RADAR_SWEEP_RADIUS} ${RADAR_SWEEP_RADIUS} 0 0 1 ${end.x} ${end.y} Z`
	);
}

/** Slices that fade behind the leading edge, so the sweep looks like it leaves a trail. */
export const radarSweepSlices = Array.from({ length: RADAR_SWEEP_SLICE_COUNT }, (_, index) => ({
	path: slicePath(-(index + 1) * RADAR_SWEEP_SLICE_DEGREES, -index * RADAR_SWEEP_SLICE_DEGREES),
	opacity: RADAR_SWEEP_LEADING_OPACITY * (1 - index / RADAR_SWEEP_SLICE_COUNT)
}));
