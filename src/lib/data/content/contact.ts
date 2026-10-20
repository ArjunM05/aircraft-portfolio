import { profile } from '../profile';
import type { ContactSection } from '../types';

export const contactSection: ContactSection = {
	kind: 'contact',
	id: 'contact',
	menuLabel: 'Contact',
	title: 'Contact',
	aircraftPartName: 'Rudder',
	partExplanation:
		'The rudder on the tail fin steers the nose left or right to set the heading. Tell me where to point next.',
	hasSampleContent: false,
	boardingPass: {
		airlineName: 'AM AIR',
		inquiryTypes: ['Hiring opportunity', 'Collaboration', 'Freelance project', 'Just saying hello'],
		destinationCode: 'MAA',
		destinationName: 'Arjun M, Chennai',
		flightCode: 'AM 2026',
		gate: 'A1',
		seat: '1A',
		boardingStatus: 'Now'
	},
	profileLinks: [
		{ label: 'LinkedIn', url: profile.linkedinUrl },
		{ label: 'GitHub', url: profile.githubUrl }
	]
};
