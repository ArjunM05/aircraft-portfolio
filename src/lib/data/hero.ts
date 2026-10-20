import type { SectionId } from './sections.js';

/** One guided route through the portfolio, offered on the landing screen. */
export interface VisitPath {
	id: string;
	title: string; // aviation-flavoured name
	duration: string; // plain, so skimmers know what they are choosing
	description: string;
	/** Sections in visiting order. Hidden sections are skipped automatically. */
	stops: SectionId[];
}

export interface HeroStat {
	value: number;
	suffix: string;
	label: string;
}

export const hero = {
	/** Set to null to hide the availability chip. */
	availability: 'Open to full-stack roles' as string | null,
	headline: 'Full-stack developer who ships dependable products.',
	techHighlights: ['TypeScript', 'Angular', 'Svelte', 'C# / ASP.NET', 'PostgreSQL', 'Python'],
	/** SAMPLE numbers: replace with your real ones, then set statsAreSample to false. */
	statsAreSample: true,
	stats: [
		{ value: 2, suffix: '+', label: 'years building software' },
		{ value: 6, suffix: '', label: 'projects built end to end' },
		{ value: 3, suffix: '', label: 'disciplines: frontend, backend, AI/ML' }
	] satisfies HeroStat[]
};

export const visitPaths: VisitPath[] = [
	{
		id: 'quick-hop',
		title: 'Quick hop',
		duration: '30 seconds',
		description: 'My projects, my skills, and how to reach me.',
		stops: ['projects', 'skills', 'contact']
	},
	{
		id: 'regional',
		title: 'Regional flight',
		duration: '2 minutes',
		description: 'Where I have worked, what I build with, and my best projects.',
		stops: ['experience', 'backend', 'projects', 'skills', 'contact']
	},
	{
		id: 'long-haul',
		title: 'Long haul',
		duration: '5+ minutes',
		description: 'Every waypoint, in order.',
		stops: [
			'experience',
			'internships',
			'freelance',
			'frontend',
			'backend',
			'ai-ml',
			'skills',
			'projects',
			'incident-report',
			'certifications',
			'education',
			'contact'
		]
	}
];
