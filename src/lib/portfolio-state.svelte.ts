import { getContext, setContext } from 'svelte';
import { sections, type SectionId } from '#lib/data/sections.js';

/** A function that takes the visitor to a section (the page provides the real one). */
type SectionNavigator = (sectionId: SectionId) => void;

const PORTFOLIO_STATE_KEY = Symbol('portfolio-state');

const CRUISE_ALTITUDE_FEET = 35_000;
const ALTITUDE_ROUNDING_FEET = 500;
/** Share of the journey spent climbing, and where the descent begins. */
const CLIMB_ENDS_AT = 0.25;
const DESCENT_BEGINS_AT = 0.75;
/** The heading sweeps from 060 to 300 degrees over the whole journey (purely decorative). */
const FIRST_HEADING_DEGREES = 60;
const HEADING_SWEEP_DEGREES = 240;

export type FlightPhase = 'Pre-flight' | 'Climb' | 'Cruise' | 'Descent' | 'Landing';

export interface FlightStatus {
	phase: FlightPhase;
	altitudeFeet: number;
	headingDegrees: number;
}

/** Treats the trip through the sections as one flight: climb, cruise, descent, landing. */
export function computeFlightStatus(sectionIndex: number, sectionCount: number): FlightStatus {
	const progress = sectionCount <= 1 ? 0 : sectionIndex / (sectionCount - 1);
	const headingDegrees = Math.round(FIRST_HEADING_DEGREES + progress * HEADING_SWEEP_DEGREES) % 360;

	if (progress === 0) return { phase: 'Pre-flight', altitudeFeet: 0, headingDegrees };
	if (progress === 1) return { phase: 'Landing', altitudeFeet: 0, headingDegrees };

	const fractionOfCruise =
		progress < CLIMB_ENDS_AT
			? progress / CLIMB_ENDS_AT
			: progress < DESCENT_BEGINS_AT
				? 1
				: (1 - progress) / (1 - DESCENT_BEGINS_AT);

	const altitudeFeet =
		Math.round((CRUISE_ALTITUDE_FEET * fractionOfCruise) / ALTITUDE_ROUNDING_FEET) *
		ALTITUDE_ROUNDING_FEET;

	const phase: FlightPhase =
		progress < CLIMB_ENDS_AT ? 'Climb' : progress < DESCENT_BEGINS_AT ? 'Cruise' : 'Descent';

	return { phase, altitudeFeet, headingDegrees };
}

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

	flightStatus = $derived(computeFlightStatus(this.activeSectionIndex, sections.length));

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
