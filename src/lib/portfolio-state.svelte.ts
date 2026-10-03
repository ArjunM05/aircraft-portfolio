import { getContext, setContext } from 'svelte';
import { sections, type SectionId } from '#lib/data/sections.js';

/** A function that takes the visitor to a section (the page provides the real one). */
type SectionNavigator = (sectionId: SectionId) => void;

const PORTFOLIO_STATE_KEY = Symbol('portfolio-state');

/**
 * State shared between the header (in +layout.svelte) and the page.
 * Created once by the layout, then read by any component below it.
 */
export class PortfolioState {
	/** Position of the section currently shown in the blueprint view. */
	activeSectionIndex = $state(0);
	/** True when the simple text-only version of the site is showing. */
	isPlainView = $state(false);
	/** True when the burger menu is open (small screens only). */
	isMenuOpen = $state(false);

	activeSection = $derived(sections[this.activeSectionIndex]);

	#sectionNavigator: SectionNavigator | null = null;

	/**
	 * The page calls this to say "I know how to navigate".
	 * Returns a cleanup function, so it can be used directly inside $effect.
	 */
	registerNavigator(navigator: SectionNavigator): () => void {
		this.#sectionNavigator = navigator;

		return () => {
			if (this.#sectionNavigator === navigator) this.#sectionNavigator = null;
		};
	}

	goToSection(sectionId: SectionId): void {
		this.isMenuOpen = false;

		if (this.isPlainView) {
			this.#scrollToPlainSection(sectionId);
			return;
		}

		this.#sectionNavigator?.(sectionId);
	}

	toggleMenu(): void {
		this.isMenuOpen = !this.isMenuOpen;
	}

	closeMenu(): void {
		this.isMenuOpen = false;
	}

	togglePlainView(): void {
		this.isPlainView = !this.isPlainView;
		this.isMenuOpen = false;
		window.scrollTo(0, 0);
	}

	#scrollToPlainSection(sectionId: SectionId): void {
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		// The page renders each plain-view section with the id "plain-<section id>".
		document.getElementById(`plain-${sectionId}`)?.scrollIntoView({
			behavior: prefersReducedMotion ? 'auto' : 'smooth',
			block: 'start'
		});
	}
}

/** Call once, in +layout.svelte. */
export function providePortfolioState(): PortfolioState {
	const portfolioState = new PortfolioState();
	setContext(PORTFOLIO_STATE_KEY, portfolioState);
	return portfolioState;
}

/** Call in any component below the layout. */
export function usePortfolioState(): PortfolioState {
	const portfolioState = getContext<PortfolioState | undefined>(PORTFOLIO_STATE_KEY);

	if (!portfolioState) {
		throw new Error(
			'usePortfolioState() must be called inside a component rendered by +layout.svelte.'
		);
	}

	return portfolioState;
}
