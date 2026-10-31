import { describe, expect, it } from 'vitest';
import {
	aircraftParts,
	getPartDisplayName,
	partMarkerPositions,
	VIEWBOX_HEIGHT,
	VIEWBOX_WIDTH
} from './geometry.js';
import { radarSweepSlices, slicePath } from './radar.js';

describe('aircraft parts', () => {
	it('has a unique id for every part', () => {
		const ids = aircraftParts.map((part) => part.id);

		expect(new Set(ids).size).toBe(ids.length);
	});

	it('draws at least one visible outline for every part', () => {
		for (const part of aircraftParts) {
			expect(part.shapes.some((shape) => shape.role === 'outline')).toBe(true);
		}
	});

	it('has a hotspot marker for exactly the parts that exist', () => {
		const partIds = aircraftParts.map((part) => part.id).sort();

		expect(Object.keys(partMarkerPositions).sort()).toEqual(partIds);
	});

	it('keeps every marker inside the drawing', () => {
		for (const marker of Object.values(partMarkerPositions)) {
			expect(marker.x).toBeGreaterThan(0);
			expect(marker.x).toBeLessThan(VIEWBOX_WIDTH);
			expect(marker.y).toBeGreaterThan(0);
			expect(marker.y).toBeLessThan(VIEWBOX_HEIGHT);
		}
	});

	it('looks up display names', () => {
		expect(getPartDisplayName('cockpit')).toBe('Cockpit');
		expect(getPartDisplayName('cargo-hold')).toBe('Cargo hold');
	});
});

describe('radar', () => {
	it('draws a slice from straight up to straight right around the aircraft centre', () => {
		expect(slicePath(0, 90)).toBe('M 200 306 L 200 6 A 300 300 0 0 1 500 306 Z');
	});

	it('fades the sweep trail away from the leading edge', () => {
		const opacities = radarSweepSlices.map((slice) => slice.opacity);

		expect(opacities).toHaveLength(6);
		expect(opacities[0]).toBeGreaterThan(0);
		for (let index = 1; index < opacities.length; index += 1) {
			expect(opacities[index]).toBeLessThan(opacities[index - 1]);
		}
	});
});
