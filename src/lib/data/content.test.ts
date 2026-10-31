import { describe, expect, it } from 'vitest';
import { getBlueprintBinding } from '#lib/blueprint/section-bindings.js';
import { sections } from '#lib/data/sections.js';
import {
	caseStudiesOf,
	makeCardId,
	workEntriesOf,
	workEntryCardId
} from '#lib/search/portfolio-index.js';

describe('portfolio content', () => {
	it('has sections with unique ids', () => {
		const ids = sections.map((section) => section.id);

		expect(ids.length).toBeGreaterThan(0);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('binds every section to an aircraft part and a camera position', () => {
		for (const section of sections) {
			const binding = getBlueprintBinding(section.id);

			expect(binding.part).toBeDefined();
			expect(binding.camera.zoom).toBeGreaterThan(0);
		}
	});

	it('gives every card an id that no other card shares', () => {
		const cardIds = sections.flatMap((section) => [
			...caseStudiesOf(section).map((caseStudy) => makeCardId(section.id, caseStudy.title)),
			...workEntriesOf(section).map((entry) => workEntryCardId(section.id, entry))
		]);
		const duplicates = cardIds.filter((id, index) => cardIds.indexOf(id) !== index);

		expect(duplicates).toEqual([]);
	});

	it('lists technologies for every project and job, so skill links can find them', () => {
		const withoutTechnologies = sections.flatMap((section) => [
			...caseStudiesOf(section)
				.filter((caseStudy) => caseStudy.technologies.length === 0)
				.map((caseStudy) => `${section.id}: ${caseStudy.title}`),
			...workEntriesOf(section)
				.filter((entry) => entry.technologies.length === 0)
				.map((entry) => `${section.id}: ${entry.role}, ${entry.organization}`)
		]);

		expect(withoutTechnologies).toEqual([]);
	});
});
