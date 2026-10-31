import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { canScrollFurther, wheelDeltaInPixels } from './wheel-forwarder.js';

function wheel(deltaY: number, deltaMode: number): WheelEvent {
	return { deltaY, deltaMode } as WheelEvent;
}

function panel(scrollTop: number, scrollHeight = 1000, clientHeight = 400): Element {
	return { scrollTop, scrollHeight, clientHeight } as Element;
}

describe('wheelDeltaInPixels', () => {
	beforeEach(() => {
		// The test environment has no browser, so the unit constants are supplied here.
		vi.stubGlobal('WheelEvent', { DOM_DELTA_PIXEL: 0, DOM_DELTA_LINE: 1, DOM_DELTA_PAGE: 2 });
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('passes pixel deltas through', () => {
		expect(wheelDeltaInPixels(wheel(120, 0), 800)).toBe(120);
	});

	it('converts lines (some mice and Firefox) to pixels', () => {
		expect(wheelDeltaInPixels(wheel(3, 1), 800)).toBe(48);
	});

	it('converts pages to the screen height', () => {
		expect(wheelDeltaInPixels(wheel(2, 2), 800)).toBe(1600);
	});

	it('keeps the sign for upward scrolls', () => {
		expect(wheelDeltaInPixels(wheel(-100, 0), 800)).toBe(-100);
	});
});

describe('canScrollFurther', () => {
	it('can scroll down but not up at the top', () => {
		expect(canScrollFurther(panel(0), 1)).toBe(true);
		expect(canScrollFurther(panel(0), -1)).toBe(false);
	});

	it('can scroll up but not down at the bottom', () => {
		expect(canScrollFurther(panel(600), 1)).toBe(false);
		expect(canScrollFurther(panel(600), -1)).toBe(true);
	});

	it('treats a fraction of a pixel from the end as the end', () => {
		expect(canScrollFurther(panel(599.5), 1)).toBe(false);
	});

	it('cannot scroll either way when the content fits', () => {
		expect(canScrollFurther(panel(0, 400, 400), 1)).toBe(false);
		expect(canScrollFurther(panel(0, 400, 400), -1)).toBe(false);
	});
});
