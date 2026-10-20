import { copyText, openInNewTab } from '#lib/browser-helpers.js';
import type { VisitPath } from '#lib/data/hero.js';
import type { SectionId } from '#lib/data/sections.js';
import type { Section } from '#lib/data/types.js';
import {
	caseStudiesOf,
	makeCardId,
	skillGroupsOf,
	workEntriesOf,
	workEntryCardId
} from './portfolio-index.js';

export type PaletteGroup = 'Section' | 'Action' | 'Project' | 'Experience' | 'Skill';

export interface PaletteEntry {
	id: string;
	group: PaletteGroup;
	label: string;
	detail?: string;
	keywords: string[];
	run: () => void;
}

/** Everything the palette needs from the rest of the app, handed in from outside. */
export interface PaletteDependencies {
	sections: readonly Section[];
	profile: { email: string; githubUrl: string };
	visitPaths: readonly VisitPath[];
	goToSection: (sectionId: SectionId) => void;
	revealCard: (cardId: string, sectionId: SectionId) => void;
	showSkill: (skill: string) => void;
	startTour: (path: VisitPath) => void;
	togglePlainView: () => void;
	downloadResume: () => void;
	openTerminal: () => void;
}

export function buildPaletteEntries(dependencies: PaletteDependencies): PaletteEntry[] {
	const {
		sections,
		profile,
		visitPaths,
		goToSection,
		revealCard,
		showSkill,
		startTour,
		togglePlainView,
		downloadResume,
		openTerminal
	} = dependencies;

	const sectionEntries: PaletteEntry[] = sections.map((section) => ({
		id: `section:${section.id}`,
		group: 'Section',
		label: section.title,
		detail: section.aircraftPartName, // so "wings" finds Skills and "elevators" finds Education
		keywords: [section.menuLabel, section.aircraftPartName],
		run: () => goToSection(section.id)
	}));

	const actionEntries: PaletteEntry[] = [
		{
			id: 'action:message',
			group: 'Action',
			label: 'Send me a message',
			detail: 'Opens the boarding-pass form',
			keywords: ['contact', 'email', 'hire', 'reach'],
			run: () => goToSection('contact')
		},
		{
			id: 'action:resume',
			group: 'Action',
			label: 'Download resume',
			detail: 'PDF',
			keywords: ['cv', 'pdf'],
			run: downloadResume
		},
		{
			id: 'action:copy-email',
			group: 'Action',
			label: 'Copy email address',
			detail: profile.email,
			keywords: ['mail', 'contact'],
			run: () => void copyText(profile.email)
		},
		{
			id: 'action:github',
			group: 'Action',
			label: 'Open GitHub',
			detail: profile.githubUrl,
			keywords: ['code', 'repositories', 'source'],
			run: () => openInNewTab(profile.githubUrl)
		},
		{
			id: 'action:plain-view',
			group: 'Action',
			label: 'Switch between aircraft and plain view',
			keywords: ['simple', 'text', 'accessible', 'document'],
			run: togglePlainView
		},
		{
			id: 'action:terminal',
			group: 'Action',
			label: 'Open the terminal',
			detail: 'Press ` anywhere',
			keywords: ['console', 'shell', 'cli', 'easter egg', 'secret'],
			run: openTerminal
		},
		...visitPaths.map((path): PaletteEntry => ({
			id: `action:tour:${path.id}`,
			group: 'Action',
			label: `Take the tour: ${path.title}`,
			detail: path.duration,
			keywords: ['guided', 'tour', 'walkthrough', path.description],
			run: () => startTour(path)
		}))
	];

	const projectEntries: PaletteEntry[] = sections.flatMap((section) =>
		caseStudiesOf(section).map((caseStudy): PaletteEntry => ({
			id: `project:${section.id}:${caseStudy.title}`,
			group: 'Project',
			label: caseStudy.title,
			detail: `${section.menuLabel} | ${caseStudy.subtitle}`,
			keywords: caseStudy.technologies,
			run: () => revealCard(makeCardId(section.id, caseStudy.title), section.id)
		}))
	);

	const experienceEntries: PaletteEntry[] = sections.flatMap((section) =>
		workEntriesOf(section).map((entry): PaletteEntry => ({
			id: `experience:${section.id}:${entry.role}:${entry.organization}`,
			group: 'Experience',
			label: entry.role,
			detail: `${entry.organization} | ${entry.period}`,
			keywords: [entry.organization, ...entry.technologies],
			run: () => revealCard(workEntryCardId(section.id, entry), section.id)
		}))
	);

	const seenSkills = new Set<string>();
	const skillEntries: PaletteEntry[] = sections.flatMap((section) =>
		skillGroupsOf(section).flatMap((group) =>
			group.skills
				.filter((skill) => {
					const key = skill.toLowerCase();
					if (seenSkills.has(key)) return false;
					seenSkills.add(key);
					return true;
				})
				.map((skill): PaletteEntry => ({
					id: `skill:${skill}`,
					group: 'Skill',
					label: skill,
					detail: `${group.name} | see where I used it`,
					keywords: [group.name],
					run: () => showSkill(skill)
				}))
		)
	);

	return [
		...sectionEntries,
		...actionEntries,
		...projectEntries,
		...experienceEntries,
		...skillEntries
	];
}
