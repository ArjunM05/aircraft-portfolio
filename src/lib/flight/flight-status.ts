const CRUISE_ALTITUDE_FEET = 35_000;
const ALTITUDE_ROUNDING_FEET = 500;
/** Share of the journey spent climbing, and where the descent begins. */
const CLIMB_ENDS_AT = 0.25;
const DESCENT_BEGINS_AT = 0.75;
/** The heading sweeps from 060 to 300 degrees over the whole journey (purely decorative). */
const FIRST_HEADING_DEGREES = 60;
const HEADING_SWEEP_DEGREES = 240;

export type FlightPhase = 'Pre-flight' | 'Climb' | 'Cruise' | 'Descent' | 'Landing';

export interface FlightStatus {
	phase: FlightPhase;
	altitudeFeet: number;
	headingDegrees: number;
}

/** Treats the trip through the sections as one flight: climb, cruise, descent, landing. */
export function computeFlightStatus(sectionIndex: number, sectionCount: number): FlightStatus {
	const progress = sectionCount <= 1 ? 0 : sectionIndex / (sectionCount - 1);
	const headingDegrees = Math.round(FIRST_HEADING_DEGREES + progress * HEADING_SWEEP_DEGREES) % 360;

	if (progress === 0) return { phase: 'Pre-flight', altitudeFeet: 0, headingDegrees };
	if (progress === 1) return { phase: 'Landing', altitudeFeet: 0, headingDegrees };

	const fractionOfCruise =
		progress < CLIMB_ENDS_AT
			? progress / CLIMB_ENDS_AT
			: progress < DESCENT_BEGINS_AT
				? 1
				: (1 - progress) / (1 - DESCENT_BEGINS_AT);

	const altitudeFeet =
		Math.round((CRUISE_ALTITUDE_FEET * fractionOfCruise) / ALTITUDE_ROUNDING_FEET) *
		ALTITUDE_ROUNDING_FEET;

	const phase: FlightPhase =
		progress < CLIMB_ENDS_AT ? 'Climb' : progress < DESCENT_BEGINS_AT ? 'Cruise' : 'Descent';

	return { phase, altitudeFeet, headingDegrees };
}
