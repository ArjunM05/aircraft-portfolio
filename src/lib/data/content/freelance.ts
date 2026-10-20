import type { FreelanceSection } from '../types';

export const freelanceSection: FreelanceSection = {
	kind: 'freelance',
	id: 'freelance',
	menuLabel: 'Freelance',
	title: 'Freelance work',
	aircraftPartName: 'Winglets',
	partExplanation:
		'Winglets are add-ons at the wingtips that improve efficiency without changing the aircraft. Freelance work is my extra mile.',
	hasSampleContent: true,
	engagements: [
		{
			title: 'Inventory dashboard for a retailer',
			subtitle: 'Frontend + backend | sample',
			facts: [
				{ label: 'Client', text: 'Local retail business' },
				{ label: 'Scope', text: 'Stock dashboard with low-stock alerts and CSV export.' },
				{ label: 'Outcome', text: 'Stock checks moved from spreadsheets to one live page.' }
			],
			flowSteps: [],
			technologies: ['Angular', 'Node.js', 'PostgreSQL'],
			disciplines: ['frontend', 'backend'],
			isSample: true,
			startsOpen: true
		},
		{
			title: 'Appointment booking API for a clinic',
			subtitle: 'Backend | sample',
			facts: [
				{ label: 'Client', text: 'Small healthcare clinic' },
				{ label: 'Scope', text: 'REST API for bookings, reminders and cancellations.' },
				{ label: 'Outcome', text: 'Double bookings eliminated and front desk workload reduced.' }
			],
			flowSteps: [],
			technologies: ['Node.js', 'Express.js', 'MongoDB'],
			disciplines: ['backend'],
			isSample: true
		},
		{
			title: 'Product image classifier for a shop',
			subtitle: 'AI/ML | sample',
			facts: [
				{ label: 'Client', text: 'Small online store' },
				{
					label: 'Scope',
					text: 'Image model that sorts product photos into categories, served through a simple API.'
				},
				{ label: 'Outcome', text: 'Listing time per product cut sharply.' }
			],
			flowSteps: [],
			technologies: ['Python', 'YOLOv8', 'Flask'],
			disciplines: ['ai-ml', 'backend'],
			isSample: true
		}
	],
	workingTerms: [
		'Fixed-scope or hourly engagements.',
		'Weekly progress updates and a demo at each milestone.',
		'Clean handover with documentation, tests and deployment notes.'
	],
	callToActionLabel: 'Book a freelance flight'
};
