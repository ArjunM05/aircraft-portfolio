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
		{
			name: 'Angular Deep Dive',
			issuer: 'Udemy',
			url: 'https://www.udemy.com/certificate/UC-3def8adb-7940-482f-bb9b-66c5c7fb1bda/'
		},
		{
			name: 'Python for Data Science',
			issuer: 'NPTEL',
			url: 'https://drive.google.com/file/d/1uNxaWAd9o1NchkqY6Ww8tvtsQoViKu2h/view?usp=drive_link'
		},
		{
			name: 'Introduction to Machine Learning',
			issuer: 'NPTEL',
			url: 'https://drive.google.com/file/d/1fyZhBVoDq5ZPH-XKgIb5G4hJO9jmfzZT/view?usp=drive_link'
		},
		{
			name: 'Social Networks',
			issuer: 'NPTEL',
			url: 'https://drive.google.com/file/d/1jUo8lcKdoPh6XWIYvky1yRPLPsx5BlEY/view?usp=drive_link'
		}
	]
};
