import type { SkillsSection } from '../types';

export const skillsSection: SkillsSection = {
	kind: 'skills',
	id: 'skills',
	menuLabel: 'Skills',
	title: 'Skills',
	aircraftPartName: 'Wings',
	partExplanation:
		'Wings generate lift and engines provide thrust. This is the stack that does both.',
	hasSampleContent: false,
	groups: [
		{
			name: 'Frontend',
			skills: ['Angular', 'React', 'Vite', 'HTML', 'CSS', 'JavaScript', 'TypeScript']
		},
		{
			name: 'Backend',
			skills: [
				'C#',
				'ASP.NET MVC',
				'.NET Core',
				'Python',
				'Node.js',
				'Express.js',
				'Django',
				'Flask'
			]
		},
		{ name: 'Databases', skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Oracle SQL', 'Supabase'] },
		{
			name: 'Cloud, tools and DevOps',
			skills: ['Git', 'Docker', 'Visual Studio', 'RESTful APIs', 'JSON', 'Postman']
		}
	]
};
