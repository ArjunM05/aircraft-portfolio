import type { SectionId } from '#lib/data/types.js';
import type { SectionCursor } from '#lib/state/section-cursor.svelte.js';
import {
	scrollDistancePerSection,
	scrollPositionForSection,
	sectionIndexFromScroll
} from './scroll-geometry.js';

export interface BlueprintScrollerOptions {
	cursor: SectionCursor;
	sectionCount: number;
	findSectionIndex: (sectionId: SectionId) => number;
	isPlainView: () => boolean;
	isPhoneLayout: () => boolean;
}

/**
 * Links the page's scroll position and the active section on desktop:
 * scrolling changes the section, and choosing a section scrolls the page.
 * Phones do not scroll between sections, so nothing happens there.
 */
export class BlueprintScroller {
	readonly #options: BlueprintScrollerOptions;

	constructor(options: BlueprintScrollerOptions) {
		this.#options = options;
	}

	goTo(sectionId: SectionId): void {
		const sectionIndex = this.#options.findSectionIndex(sectionId);
		if (sectionIndex === -1) return;

		this.#options.cursor.index = sectionIndex;
		if (!this.#options.isPhoneLayout()) {
			window.scrollTo({ top: this.#positionFor(sectionIndex), behavior: 'auto' });
		}
	}

	/** Call on scroll and resize. */
	syncFromScroll(): void {
		if (this.#options.isPhoneLayout() || this.#options.isPlainView()) return;

		this.#options.cursor.index = sectionIndexFromScroll(
			window.scrollY,
			scrollDistancePerSection(window.innerHeight),
			this.#options.sectionCount - 1
		);
	}

	/** Puts the scroll position back in step with the active section. */
	restoreScrollPosition(isPhone: boolean): void {
		window.scrollTo({
			top: isPhone ? 0 : this.#positionFor(this.#options.cursor.index),
			behavior: 'auto'
		});
	}

	#positionFor(sectionIndex: number): number {
		return scrollPositionForSection(sectionIndex, scrollDistancePerSection(window.innerHeight));
	}
}
