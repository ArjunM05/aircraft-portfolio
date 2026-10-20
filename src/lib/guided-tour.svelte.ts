import type { VisitPath } from '#lib/data/hero.js';
import type { SectionId } from '#lib/data/sections.js';

export interface TourObserver {
	started?: (path: VisitPath) => void;
	finished?: (path: VisitPath) => void;
}

/** A short guided route through the sections, started from the landing screen. */
export class GuidedTour {
	activePath = $state<VisitPath | null>(null);
	stops = $state<SectionId[]>([]);
	stopNumber = $state(0); // zero-based

	readonly #navigateTo: (sectionId: SectionId) => void;
	readonly #isVisible: (sectionId: SectionId) => boolean;

	readonly #observer: TourObserver;

	constructor(
		navigateTo: (sectionId: SectionId) => void,
		isVisible: (sectionId: SectionId) => boolean,
		observer: TourObserver = {}
	) {
		this.#navigateTo = navigateTo;
		this.#isVisible = isVisible;
		this.#observer = observer;
	}

	get isActive(): boolean {
		return this.activePath !== null;
	}

	get currentSectionId(): SectionId | undefined {
		return this.stops[this.stopNumber];
	}

	get isLastStop(): boolean {
		return this.stopNumber >= this.stops.length - 1;
	}

	start(path: VisitPath): void {
		const visibleStops = path.stops.filter(this.#isVisible);
		if (visibleStops.length === 0) return;

		// State first, then navigate, so watchers never see a mismatch.
		this.activePath = path;
		this.stops = visibleStops;
		this.stopNumber = 0;

		this.#observer.started?.(path);

		this.#navigateTo(visibleStops[0]);
	}

	next(): void {
		if (this.isLastStop) {
			if (this.activePath) this.#observer.finished?.(this.activePath);
			this.stop();
			return;
		}
		this.stopNumber += 1;
		this.#navigateTo(this.stops[this.stopNumber]);
	}

	previous(): void {
		if (this.stopNumber === 0) return;
		this.stopNumber -= 1;
		this.#navigateTo(this.stops[this.stopNumber]);
	}

	stop(): void {
		this.activePath = null;
		this.stops = [];
		this.stopNumber = 0;
	}
}
