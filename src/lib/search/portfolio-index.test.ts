import { describe, expect, it } from 'vitest';
import type { CaseStudy, Section } from '#lib/data/types.js';
import {
	caseStudiesOf,
	countEvidence,
	findSkillEvidence,
	makeCardId,
	rankTechnologies,
	skillGroupsOf,
	workEntriesOf,
	workEntryCardId
} from './portfolio-index.js';

function caseStudy(title: string, technologies: string[]): CaseStudy {
	return {
		title,
		subtitle: '',
		facts: [],
		flowSteps: [],
		technologies,
		disciplines: [],
		isSample: false
	} as CaseStudy;
}

// Only the fields these functions read are filled in.
const projectsSection = {
	kind: 'projects',
	id: 'projects',
	menuLabel: 'Projects',
	projects: [
		caseStudy('Cargo Tracker', ['C# / ASP.NET', 'PostgreSQL']),
		caseStudy('Portfolio', ['JavaScript', 'Svelte'])
	]
} as unknown as Section;

const workSection = {
	kind: 'work-history',
	id: 'experience',
	menuLabel: 'Experience',
	entries: [
		{ role: 'Developer', organization: 'LogiTrans', technologies: ['C#', 'PostgreSQL'] },
		{ role: 'Intern', organization: 'Annam.AI', technologies: ['Python'] }
	]
} as unknown as Section;

const skillsSection = {
	kind: 'skills',
	id: 'skills',
	menuLabel: 'Skills',
	groups: [{ name: 'Backend', skills: ['C#'] }]
} as unknown as Section;

const allSections = [projectsSection, workSection, skillsSection];

describe('section readers', () => {
	it('reads projects, work entries and skill groups from the right kind of section', () => {
		expect(caseStudiesOf(projectsSection)).toHaveLength(2);
		expect(workEntriesOf(workSection)).toHaveLength(2);
		expect(skillGroupsOf(skillsSection)).toEqual([{ name: 'Backend', skills: ['C#'] }]);
	});

	it('returns nothing from other kinds of section', () => {
		expect(caseStudiesOf(skillsSection)).toEqual([]);
		expect(workEntriesOf(projectsSection)).toEqual([]);
		expect(skillGroupsOf(projectsSection)).toEqual([]);
	});
});

describe('card ids', () => {
	it('turns a title into a stable slug', () => {
		expect(makeCardId('projects', 'Cargo Tracker')).toBe('projects:cargo-tracker');
		expect(makeCardId('projects', '  --Hello, World!-- ')).toBe('projects:hello-world');
	});

	it('builds a work entry id from role and organisation', () => {
		expect(
			workEntryCardId('experience', { role: 'Software Engineer', organization: 'Annam.AI' })
		).toBe('experience:software-engineer-annam-ai');
	});
});

describe('findSkillEvidence', () => {
	it('finds the projects and jobs that used a skill', () => {
		const evidence = findSkillEvidence('C#', allSections);

		expect(evidence.caseStudies).toEqual([
			{
				title: 'Cargo Tracker',
				sectionId: 'projects',
				sectionLabel: 'Projects',
				cardId: 'projects:cargo-tracker'
			}
		]);
		expect(evidence.workEntries).toEqual([
			{
				title: 'Developer, LogiTrans',
				sectionId: 'experience',
				sectionLabel: 'Experience',
				cardId: 'experience:developer-logitrans'
			}
		]);
		expect(countEvidence(evidence)).toBe(2);
	});

	it('does not confuse Java with JavaScript', () => {
		expect(countEvidence(findSkillEvidence('Java', allSections))).toBe(0);
	});

	it('finds nothing for an unused skill', () => {
		expect(countEvidence(findSkillEvidence('Rust', allSections))).toBe(0);
	});
});

describe('rankTechnologies', () => {
	const projects = [
		caseStudy('One', ['TypeScript', 'React']),
		caseStudy('Two', ['TypeScript', 'C#']),
		caseStudy('Three', ['TypeScript', 'React', 'Python'])
	];

	it('orders by how often a technology is used, then alphabetically', () => {
		expect(rankTechnologies(projects, 10)).toEqual(['TypeScript', 'React', 'C#', 'Python']);
	});

	it('keeps only the top few', () => {
		expect(rankTechnologies(projects, 2)).toEqual(['TypeScript', 'React']);
	});

	it('adds a chosen technology that did not make the cut, without duplicating one that did', () => {
		expect(rankTechnologies(projects, 2, 'Python')).toEqual(['TypeScript', 'React', 'Python']);
		expect(rankTechnologies(projects, 2, 'React')).toEqual(['TypeScript', 'React']);
	});
});
