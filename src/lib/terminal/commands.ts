import type { SectionId } from '#lib/data/sections.js';
import type { Section } from '#lib/data/types.js';
import { caseStudiesOf, skillGroupsOf } from '#lib/search/portfolio-index.js';

export interface CommandResult {
	lines?: string[];
	clear?: boolean;
	/** Close the terminal after this command. */
	exit?: boolean;
}

export interface TerminalCommand {
	name: string;
	summary: string;
	run: (args: string[]) => CommandResult | void;
}

export interface TerminalDependencies {
	profile: {
		name: string;
		jobTitle: string;
		location: string;
		email: string;
		githubUrl: string;
	};
	sections: readonly Section[];
	flight: () => { altitudeFeet: number; headingDegrees: number; phase: string };
	goToSection: (sectionId: SectionId) => void;
	downloadResume: () => void;
	openUrl: (url: string) => void;
}

/** To add a command, add one object to this list. Nothing else needs to change. */
export function buildTerminalCommands(dependencies: TerminalDependencies): TerminalCommand[] {
	const { profile, sections, flight, goToSection, downloadResume, openUrl } = dependencies;

	const commands: TerminalCommand[] = [
		{
			name: 'help',
			summary: 'List the commands',
			run: () => ({
				lines: commands.map((command) => `${command.name.padEnd(10)}${command.summary}`)
			})
		},
		{
			name: 'whoami',
			summary: 'Who is this?',
			run: () => ({
				lines: [
					`${profile.name}, ${profile.jobTitle}`,
					profile.location,
					'Full-stack developer. Aspiring pilot. Occasionally both at once.'
				]
			})
		},
		{
			name: 'ls',
			summary: 'List the waypoints (sections)',
			run: () => ({ lines: [sections.map((section) => `${section.id}/`).join('  ')] })
		},
		{
			name: 'cd',
			summary: 'Go to a waypoint: cd projects',
			run: (args) => {
				const target = (args[0] ?? '').replace(/\/$/, '');
				if (target === '' || target === '~' || target === '..') {
					goToSection('intro');
					return { lines: ['Back at the gate.'], exit: true };
				}

				const section = sections.find((candidate) => candidate.id === target);
				if (!section) return { lines: [`cd: no such waypoint: ${target}. Try 'ls'.`] };

				goToSection(section.id);
				return { lines: [`Cleared to waypoint: ${section.title}`], exit: true };
			}
		},
		{
			name: 'skills',
			summary: 'What I work with',
			run: () => ({
				lines: sections.flatMap((section) =>
					skillGroupsOf(section).map((group) => `${group.name}: ${group.skills.join(', ')}`)
				)
			})
		},
		{
			name: 'projects',
			summary: 'What I have built',
			run: () => {
				const projectsSection = sections.find((section) => section.kind === 'projects');
				if (!projectsSection) return { lines: ['No projects on the manifest right now.'] };

				return {
					lines: caseStudiesOf(projectsSection).map(
						(project) => `- ${project.title} [${project.technologies.join(', ')}]`
					)
				};
			}
		},
		{
			name: 'contact',
			summary: 'How to reach me',
			run: () => ({
				lines: [
					`email : ${profile.email}`,
					`github: ${profile.githubUrl}`,
					"Fast lane: try 'sudo hire arjun'."
				]
			})
		},
		{
			name: 'resume',
			summary: 'Download my resume',
			run: () => {
				downloadResume();
				return { lines: ['Downloading resume...'] };
			}
		},
		{
			name: 'github',
			summary: 'Open my GitHub',
			run: () => {
				openUrl(profile.githubUrl);
				return { lines: ['Opening GitHub in a new tab...'] };
			}
		},
		{
			name: 'flight',
			summary: 'Current flight status',
			run: () => {
				const status = flight();
				return {
					lines: [
						'Aircraft : Airbus A350-900',
						`Phase    : ${status.phase}`,
						`Altitude : ${Math.round(status.altitudeFeet).toLocaleString('en-US')} ft`,
						`Heading  : ${String(Math.round(status.headingDegrees)).padStart(3, '0')} deg`
					]
				};
			}
		},
		{
			name: 'sudo',
			summary: 'Try it',
			run: (args) => {
				if (args.join(' ').toLowerCase() === 'hire arjun') {
					goToSection('contact');
					return {
						lines: [
							'[sudo] password for visitor: ********',
							'Permission granted. Cleared for contact. Opening the boarding pass...'
						],
						exit: true
					};
				}
				return {
					lines: ['visitor is not in the sudoers file. This incident will be reported.']
				};
			}
		},
		{ name: 'clear', summary: 'Clear the screen', run: () => ({ clear: true }) },
		{ name: 'exit', summary: 'Close the terminal', run: () => ({ exit: true }) }
	];

	return commands;
}
