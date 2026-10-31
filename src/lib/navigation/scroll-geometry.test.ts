import { describe, expect, it } from 'vitest';
import {
	SCROLL_DISTANCE_PER_SECTION_VH,
	scrollDistancePerSection,
	scrollPositionForSection,
	sectionIndexFromScroll
} from './scroll-geometry.js';

describe('scroll geometry', () => {
	const distance = scrollDistancePerSection(1000);

	it('uses a share of the screen height per section', () => {
		expect(SCROLL_DISTANCE_PER_SECTION_VH).toBe(45);
		expect(distance).toBe(450);
	});

	it('puts the first section at the very top and lands just inside the others', () => {
		expect(scrollPositionForSection(0, distance)).toBe(0);
		expect(scrollPositionForSection(2, distance)).toBe(902);
	});

	it('picks the nearest section for a scroll position', () => {
		expect(sectionIndexFromScroll(0, distance, 12)).toBe(0);
		expect(sectionIndexFromScroll(224, distance, 12)).toBe(0);
		expect(sectionIndexFromScroll(226, distance, 12)).toBe(1);
	});

	it('never goes outside the list of sections', () => {
		expect(sectionIndexFromScroll(-50, distance, 12)).toBe(0);
		expect(sectionIndexFromScroll(100_000, distance, 12)).toBe(12);
	});

	it('agrees with itself: going to a section and reading the position back gives the same section', () => {
		for (let index = 0; index <= 12; index += 1) {
			const position = scrollPositionForSection(index, distance);

			expect(sectionIndexFromScroll(position, distance, 12)).toBe(index);
		}
	});
});
