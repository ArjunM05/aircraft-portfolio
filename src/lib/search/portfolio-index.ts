import type { CaseStudy, Section, WorkEntry } from '#lib/data/types.js';
import type { SectionId } from '#lib/data/sections.js';
import { termsOverlap } from './term-matching.js';

/** Every project, system or engagement a section contains. */
export function caseStudiesOf(section: Section): CaseStudy[] {
	switch (section.kind) {
		case 'projects':
		case 'frontend':
		case 'backend':
		case 'ai-ml':
			return section.projects;
		case 'freelance':
			return section.engagements;
		default:
			return [];
	}
}

export function workEntriesOf(section: Section): WorkEntry[] {
	return section.kind === 'work-history' ? section.entries : [];
}

export function skillGroupsOf(section: Section): { name: string; skills: string[] }[] {
	return section.kind === 'skills' ? section.groups : [];
}

/** A stable id for a card, such as "projects:shipment-platform". Cards and links must agree on it. */
export function makeCardId(group: string, title: string): string {
	const slug = title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
	return `${group}:${slug}`;
}

export function workEntryCardId(
	sectionId: string,
	entry: Pick<WorkEntry, 'role' | 'organization'>
): string {
	return makeCardId(sectionId, `${entry.role} ${entry.organization}`);
}

export interface EvidenceItem {
	title: string;
	sectionId: SectionId;
	sectionLabel: string;
	cardId: string;
}

export interface SkillEvidence {
	caseStudies: EvidenceItem[];
	workEntries: EvidenceItem[];
}

/** Where a skill shows up: both projects and jobs list the technologies they used. */
export function findSkillEvidence(skill: string, sections: readonly Section[]): SkillEvidence {
	const evidence: SkillEvidence = { caseStudies: [], workEntries: [] };

	for (const section of sections) {
		for (const caseStudy of caseStudiesOf(section)) {
			if (caseStudy.technologies.some((technology) => termsOverlap(technology, skill))) {
				evidence.caseStudies.push({
					title: caseStudy.title,
					sectionId: section.id,
					sectionLabel: section.menuLabel,
					cardId: makeCardId(section.id, caseStudy.title)
				});
			}
		}

		for (const entry of workEntriesOf(section)) {
			if (entry.technologies.some((technology) => termsOverlap(technology, skill))) {
				evidence.workEntries.push({
					title: `${entry.role}, ${entry.organization}`,
					sectionId: section.id,
					sectionLabel: section.menuLabel,
					cardId: workEntryCardId(section.id, entry)
				});
			}
		}
	}

	return evidence;
}

export function countEvidence(evidence: SkillEvidence): number {
	return evidence.caseStudies.length + evidence.workEntries.length;
}

/** The most-used technologies across some projects, most frequent first. */
export function rankTechnologies(
	projects: readonly CaseStudy[],
	limit: number,
	alwaysInclude?: string | null
): string[] {
	const usageCounts = new Map<string, number>();
	for (const project of projects) {
		for (const technology of project.technologies) {
			usageCounts.set(technology, (usageCounts.get(technology) ?? 0) + 1);
		}
	}

	const ranked = [...usageCounts.entries()]
		.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
		.map(([technology]) => technology)
		.slice(0, limit);

	if (alwaysInclude && !ranked.includes(alwaysInclude)) ranked.push(alwaysInclude);
	return ranked;
}
