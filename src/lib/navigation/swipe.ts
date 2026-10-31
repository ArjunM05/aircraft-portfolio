const SWIPE_DISTANCE_THRESHOLD_PX = 50;

/** 1 moves forward, -1 moves back. */
export type SwipeDirection = 1 | -1;

/** Swiping left moves forward, like turning a page. Short movements are ignored. */
export function swipeDirection(
	startX: number,
	endX: number,
	thresholdPx = SWIPE_DISTANCE_THRESHOLD_PX
): SwipeDirection | null {
	const horizontalMovement = endX - startX;
	if (Math.abs(horizontalMovement) < thresholdPx) return null;
	return horizontalMovement < 0 ? 1 : -1;
}

export interface SwipeOptions {
	/** Swipes are only listened for when this is true (phones). */
	enabled: boolean;
	onSwipe: (direction: SwipeDirection) => void;
}

/** Svelte action: `use:swipe={{ enabled, onSwipe }}`. */
export function swipe(element: HTMLElement, initialOptions: SwipeOptions) {
	let options = initialOptions;
	let startX: number | null = null;

	function handleTouchStart(event: TouchEvent) {
		startX = event.touches[0].clientX;
	}

	function handleTouchEnd(event: TouchEvent) {
		if (startX === null || !options.enabled) return;

		const direction = swipeDirection(startX, event.changedTouches[0].clientX);
		startX = null;
		if (direction) options.onSwipe(direction);
	}

	element.addEventListener('touchstart', handleTouchStart, { passive: true });
	element.addEventListener('touchend', handleTouchEnd, { passive: true });

	return {
		update(nextOptions: SwipeOptions) {
			options = nextOptions;
		},
		destroy() {
			element.removeEventListener('touchstart', handleTouchStart);
			element.removeEventListener('touchend', handleTouchEnd);
		}
	};
}
