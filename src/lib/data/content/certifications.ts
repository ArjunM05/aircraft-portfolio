import type { CertificationsSection } from '../types';

export const certificationsSection: CertificationsSection = {
	kind: 'certifications',
	id: 'certifications',
	menuLabel: 'Certs',
	title: 'Certifications',
	aircraftPartName: 'Ailerons',
	partExplanation:
		'Ailerons sit on the outer wings and roll the aircraft into a turn. Each certification turned my path a few degrees.',
	hasSampleContent: false,
	certifications: [
		'Angular Deep Dive (Udemy)',
		'Python for Data Science (NPTEL)',
		'Introduction to Machine Learning (NPTEL)',
		'Social Networks (NPTEL)'
	]
};
