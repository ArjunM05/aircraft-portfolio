const LINE_HEIGHT_PX = 16;
/** After the content stops moving, wait this long before passing scrolls on to the page. */
const PAUSE_BEFORE_FORWARDING_MS = 300;

type ScrollDirection = 1 | -1;

/** Wheel distance in pixels, whatever unit the browser reports. */
export function wheelDeltaInPixels(event: WheelEvent, viewportHeightPx: number): number {
	if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return event.deltaY * LINE_HEIGHT_PX;
	if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) return event.deltaY * viewportHeightPx;
	return event.deltaY;
}

/** Can this element still scroll in the given direction (1 is down, -1 is up)? */
export function canScrollFurther(element: Element, direction: ScrollDirection): boolean {
	const distanceBelow = element.scrollHeight - element.clientHeight - element.scrollTop;
	return direction === 1 ? distanceBelow > 1 : element.scrollTop > 1;
}

function isScrollContainer(element: Element): boolean {
	const { overflowY } = getComputedStyle(element);
	return overflowY === 'auto' || overflowY === 'scroll';
}

/**
 * Is there something between the pointer and the panel's edge that can still scroll this way?
 * That includes the panel itself and anything scrollable inside it, such as a code block.
 */
export function hasScrollRoom(
	target: EventTarget | null,
	panel: Element,
	direction: ScrollDirection
): boolean {
	let element = target instanceof Element ? target : null;

	while (element) {
		if (isScrollContainer(element) && canScrollFurther(element, direction)) return true;
		if (element === panel) return false;
		element = element.parentElement;
	}

	return false;
}

export interface WheelForwarderOptions {
	/** False on phones, where the page itself does not move between sections. */
	isEnabled: () => boolean;
}

/**
 * Makes the content panel behave like a normal page. The wheel scrolls the content first.
 * Once the content has reached its end, the wheel moves the whole page, which moves to the next section.
 */
export class WheelForwarder {
	readonly #options: WheelForwarderOptions;
	#lastPanelScrollAt = 0;
	#startNextPanelAtEnd = false;

	constructor(options: WheelForwarderOptions) {
		this.#options = options;
	}

	/** Svelte action: `use:forwarder.attach` on the scrolling panel. */
	attach = (panel: HTMLElement) => {
		const handleWheel = (event: WheelEvent) => this.#handleWheel(event, panel);
		// Not passive, because the handler may cancel the wheel to avoid scrolling twice.
		panel.addEventListener('wheel', handleWheel, { passive: false });

		// Arriving from the section below: start at the end, so scrolling up carries on reading.
		if (this.#startNextPanelAtEnd) {
			this.#startNextPanelAtEnd = false;
			panel.scrollTop = panel.scrollHeight;
		}

		return {
			destroy() {
				panel.removeEventListener('wheel', handleWheel);
			}
		};
	};

	#handleWheel(event: WheelEvent, panel: HTMLElement): void {
		if (!this.#options.isEnabled() || event.ctrlKey) return;
		// Sideways scrolls and pinch-zoom are none of our business.
		if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

		const deltaPx = wheelDeltaInPixels(event, window.innerHeight);
		if (deltaPx === 0) return;

		const direction: ScrollDirection = deltaPx > 0 ? 1 : -1;
		const now = performance.now();

		// The content can still move: let the browser scroll it.
		if (hasScrollRoom(event.target, panel, direction)) {
			this.#lastPanelScrollAt = now;
			return;
		}

		event.preventDefault();

		// The content has only just stopped moving (a fast wheel or touchpad momentum).
		// Wait for a fresh scroll, so reading to the end never jumps to the next section.
		if (now - this.#lastPanelScrollAt < PAUSE_BEFORE_FORWARDING_MS) {
			this.#lastPanelScrollAt = now;
			return;
		}

		if (direction === -1) this.#startNextPanelAtEnd = true;
		window.scrollBy({ top: deltaPx, behavior: 'auto' });
	}
}
