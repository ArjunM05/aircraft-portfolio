import { describe, expect, it } from 'vitest';
import { buildCameraTransform, hasArrived, stepTowards, viewFrameFor } from './camera-math.js';

describe('stepTowards', () => {
	const start = { centerX: 0, centerY: 0, zoom: 1 };
	const target = { centerX: 100, centerY: 50, zoom: 2 };

	it('moves a share of the way', () => {
		expect(stepTowards(start, target, 0.5)).toEqual({ centerX: 50, centerY: 25, zoom: 1.5 });
	});

	it('stays put at 0 and jumps at 1', () => {
		expect(stepTowards(start, target, 0)).toEqual(start);
		expect(stepTowards(start, target, 1)).toEqual(target);
	});

	it('gets close to the target after enough frames, without overshooting', () => {
		let current = start;
		let frames = 0;

		while (!hasArrived(current, target) && frames < 500) {
			current = stepTowards(current, target, 0.14);
			expect(current.centerX).toBeLessThan(100.0001);
			frames += 1;
		}

		expect(frames).toBeGreaterThan(1);
		expect(frames).toBeLessThan(120);
	});
});

describe('hasArrived', () => {
	const target = { centerX: 200, centerY: 300, zoom: 1.5 };

	it('is true at the target and very near it', () => {
		expect(hasArrived(target, target)).toBe(true);
		expect(hasArrived({ ...target, centerX: 200.01 }, target)).toBe(true);
	});

	it('is false while still travelling', () => {
		expect(hasArrived({ ...target, centerX: 190 }, target)).toBe(false);
	});

	it('counts small zoom differences more heavily than small position differences', () => {
		expect(hasArrived({ ...target, zoom: 1.502 }, target)).toBe(false);
	});
});

describe('viewFrameFor', () => {
	it('uses the portrait drawing size for a vertical aircraft', () => {
		expect(viewFrameFor('vertical')).toEqual({ isHorizontal: false, width: 400, height: 640 });
	});

	it('swaps the sides for a horizontal aircraft', () => {
		expect(viewFrameFor('horizontal')).toEqual({ isHorizontal: true, width: 640, height: 400 });
	});
});

describe('buildCameraTransform', () => {
	const camera = { centerX: 200, centerY: 306, zoom: 1 };

	it('centres the camera in a vertical view', () => {
		expect(buildCameraTransform(camera, viewFrameFor('vertical'))).toBe(
			'translate(200 320) scale(1) translate(-200 -306)'
		);
	});

	it('turns the aircraft a quarter turn in a horizontal view', () => {
		expect(buildCameraTransform(camera, viewFrameFor('horizontal'))).toBe(
			'translate(320 200) rotate(-90) scale(1) translate(-200 -306)'
		);
	});
});
