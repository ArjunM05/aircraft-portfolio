import { describe, expect, it } from 'vitest';
import { computeFlightStatus } from './flight-status.js';

const SECTION_COUNT = 13;

describe('computeFlightStatus', () => {
	it('starts on the ground before the flight', () => {
		expect(computeFlightStatus(0, SECTION_COUNT)).toEqual({
			phase: 'Pre-flight',
			altitudeFeet: 0,
			headingDegrees: 60
		});
	});

	it('is back on the ground at the last section', () => {
		expect(computeFlightStatus(SECTION_COUNT - 1, SECTION_COUNT)).toEqual({
			phase: 'Landing',
			altitudeFeet: 0,
			headingDegrees: 300
		});
	});

	it('climbs, cruises at 35,000 feet, then descends', () => {
		expect(computeFlightStatus(1, SECTION_COUNT)).toEqual({
			phase: 'Climb',
			altitudeFeet: 11_500,
			headingDegrees: 80
		});
		expect(computeFlightStatus(6, SECTION_COUNT)).toEqual({
			phase: 'Cruise',
			altitudeFeet: 35_000,
			headingDegrees: 180
		});
		expect(computeFlightStatus(10, SECTION_COUNT).phase).toBe('Descent');
		expect(computeFlightStatus(10, SECTION_COUNT).altitudeFeet).toBe(23_500);
	});

	it('reaches cruise exactly when the climb ends', () => {
		const status = computeFlightStatus(3, SECTION_COUNT);

		expect(status.phase).toBe('Cruise');
		expect(status.altitudeFeet).toBe(35_000);
	});

	it('is symmetrical: the descent mirrors the climb', () => {
		expect(computeFlightStatus(2, SECTION_COUNT).altitudeFeet).toBe(
			computeFlightStatus(10, SECTION_COUNT).altitudeFeet
		);
	});

	it('always gives round altitudes and compass-valid headings', () => {
		for (let index = 0; index < SECTION_COUNT; index += 1) {
			const { altitudeFeet, headingDegrees } = computeFlightStatus(index, SECTION_COUNT);

			expect(altitudeFeet % 500).toBe(0);
			expect(headingDegrees).toBeGreaterThan(-1);
			expect(headingDegrees).toBeLessThan(360);
		}
	});

	it('copes with a single section', () => {
		expect(computeFlightStatus(0, 1).phase).toBe('Pre-flight');
	});
});
