import { describe, expect, it } from 'vitest';
import { swipeDirection } from './swipe.js';

describe('swipeDirection', () => {
	it('moves forward when swiping left, like turning a page', () => {
		expect(swipeDirection(300, 200)).toBe(1);
	});

	it('moves back when swiping right', () => {
		expect(swipeDirection(200, 300)).toBe(-1);
	});

	it('ignores small movements', () => {
		expect(swipeDirection(200, 230)).toBeNull();
		expect(swipeDirection(200, 200)).toBeNull();
	});

	it('counts a movement exactly as long as the threshold', () => {
		expect(swipeDirection(200, 150)).toBe(1);
	});

	it('accepts a custom threshold', () => {
		expect(swipeDirection(0, 10, 5)).toBe(-1);
		expect(swipeDirection(0, 10, 20)).toBeNull();
	});
});
