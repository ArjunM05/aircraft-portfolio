import type { EducationSection } from '../types';

export const educationSection: EducationSection = {
	kind: 'education',
	id: 'education',
	menuLabel: 'Education',
	title: 'Education',
	aircraftPartName: 'Elevators',
	partExplanation:
		'Elevators on the tail control pitch, raising or lowering the nose. Education is what lifts a person up.',
	hasSampleContent: false,
	entries: [
		{
			degree: 'B.Tech, Computer Science Engineering',
			institution: 'Vellore Institute of Technology (VIT), Chennai',
			period: '2021 to 2025'
			// highlights: ['CGPA: ...', 'Relevant coursework: ...']   // optional
		},
		{
			degree: 'High School (SSC)',
			institution: 'D.A.V Senior Secondary School, Chennai',
			period: '2021',
			highlights: ['Score: 93.2%']
		}
	]
};
