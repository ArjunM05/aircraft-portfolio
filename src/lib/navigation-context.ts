import { getContext, setContext } from 'svelte';
import type { SectionId } from '#lib/data/sections.js';

export type GoToSection = (sectionId: SectionId) => void;

const GO_TO_SECTION_KEY = Symbol('go-to-section');

/** Call once in the page that owns navigation. Every child component can then use it. */
export function provideNavigation(goToSection: GoToSection): void {
	setContext(GO_TO_SECTION_KEY, goToSection);
}

/** Call in any component that has a link to another section. */
export function useNavigation(): GoToSection {
	// Falls back to doing nothing, so components also work on their own in isolation.
	return getContext<GoToSection | undefined>(GO_TO_SECTION_KEY) ?? (() => {});
}
