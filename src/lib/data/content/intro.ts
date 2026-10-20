import { profile } from '../profile';
import type { IntroSection } from '../types';

export const introSection: IntroSection = {
	kind: 'intro',
	id: 'intro',
	menuLabel: 'Intro',
	title: profile.name,
	aircraftPartName: 'Cockpit',
	partExplanation:
		'The cockpit is where the crew flies the aircraft from, and where every flight begins. Meet the pilot of this one.',
	hasSampleContent: false,
	jobTitle: profile.jobTitle,
	tagline: profile.tagline,
	// gauges: [
	// 	{ percent: 40, displayValue: '-40%', label: 'Manual tracking time' },
	// 	{ percent: 25, displayValue: '+25%', label: 'Data load efficiency' },
	// 	{ percent: 98, displayValue: '98%', label: 'Detection accuracy' }
	// ],
	biography: [
		'I am a Computer Science Engineering graduate specializing in full-stack web development and machine learning. I enjoy architecting robust backend microservices, optimizing database performance, and bridging the gap between complex AI models and seamless user interfaces.',
		'I am an aspiring pilot and I love everything about aviation, so this portfolio is drawn as an Airbus A350-900.'
	],
	exploreLinks: [
		{ sectionId: 'frontend', label: 'Frontend' },
		{ sectionId: 'backend', label: 'Backend' },
		{ sectionId: 'ai-ml', label: 'AI / ML' },
		{ sectionId: 'freelance', label: 'Freelance' }
	]
};
