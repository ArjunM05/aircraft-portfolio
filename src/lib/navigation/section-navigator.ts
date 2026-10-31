import type { SectionId } from '#lib/data/types.js';

type Navigation = (sectionId: SectionId) => void;

export interface SectionNavigatorDependencies {
	isPlainView: () => boolean;
	/** How to reach a section in plain view. */
	scrollToPlainSection: Navigation;
	/** Runs before every jump, for example to close the burger menu. */
	onNavigate?: () => void;
}

/**
 * The one answer to "take me to this section", in either view.
 * Plain view is handled here. The blueprint page registers how it navigates.
 */
export class SectionNavigator {
	readonly #dependencies: SectionNavigatorDependencies;
	#blueprintNavigation: Navigation | null = null;

	constructor(dependencies: SectionNavigatorDependencies) {
		this.#dependencies = dependencies;
	}

	/** Returns a cleanup function, so it can be used directly inside $effect. */
	registerBlueprintNavigation(navigation: Navigation): () => void {
		this.#blueprintNavigation = navigation;

		return () => {
			if (this.#blueprintNavigation === navigation) this.#blueprintNavigation = null;
		};
	}

	goTo(sectionId: SectionId): void {
		this.#dependencies.onNavigate?.();

		if (this.#dependencies.isPlainView()) {
			this.#dependencies.scrollToPlainSection(sectionId);
		} else {
			this.#blueprintNavigation?.(sectionId);
		}
	}
}
