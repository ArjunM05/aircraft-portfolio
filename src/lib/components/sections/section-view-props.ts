import type { Section } from '#lib/data/types.js';

/** What every section view receives. Each view narrows `S` to its own section type. */
export interface SectionViewProps<S extends Section = Section> {
	section: S;
	/** Plain view: open every accordion and let them stay open together. */
	expandAll?: boolean;
}
