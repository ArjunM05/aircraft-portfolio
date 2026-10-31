import type { SectionId } from '#lib/data/types.js';

/** Plain view is one long page. Each section has the id "plain-<section id>". */
export function scrollToPlainSection(sectionId: SectionId): void {
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	document.getElementById(`plain-${sectionId}`)?.scrollIntoView({
		behavior: prefersReducedMotion ? 'auto' : 'smooth',
		block: 'start'
	});
}
