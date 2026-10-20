import type { WorkHistorySection } from '../types';

export const experienceSection: WorkHistorySection = {
	kind: 'work-history',
	id: 'experience',
	menuLabel: 'Experience',
	title: 'Experience',
	aircraftPartName: 'Fuselage',
	partExplanation:
		'The fuselage is the main body that holds the crew, cargo and every other part together. Full-time work is what holds a career together.',
	hasSampleContent: false,
	entries: [
		{
			role: 'Full Stack Developer',
			organization: 'LogiTrans Pvt. Ltd.',
			period: 'Sep 2025 to present',
			highlights: [
				'Architected scalable shipment tracking REST APIs using ASP.NET MVC and C#, reducing manual tracking processing time by 40%.',
				'Optimized complex backend queries in PostgreSQL, improving data load efficiency by 25% for high-volume records.',
				'Built dynamic Angular and TypeScript modules with real-time data synchronization to backend services.'
			],
			technologies: ['ASP.NET MVC', 'C#', 'PostgreSQL', 'Angular', 'TypeScript', 'REST APIs'],
			disciplines: ['frontend', 'backend'],
			startsOpen: true
		}
	]
};

export const internshipsSection: WorkHistorySection = {
	kind: 'work-history',
	id: 'internships',
	menuLabel: 'Interns',
	title: 'Internships',
	aircraftPartName: 'Flaps',
	partExplanation:
		"Flaps extend from the wing's trailing edge to add lift at low speed, like at takeoff. Internships gave my career its first lift.",
	hasSampleContent: false,
	entries: [
		{
			role: 'Software Engineering Intern',
			organization: 'Annam.AI - IIT Ropar',
			period: 'May to Jul 2025',
			highlights: [
				'Deployed a cloud-based smart pest-detection web application with robust backend REST endpoints in Python and Flask.',
				'Integrated React/Vite frontends with backend ML inference APIs (YOLOv11) for minimal latency during real-time evaluations.'
			],
			technologies: ['Python', 'Flask', 'React', 'Vite', 'YOLOv11', 'REST APIs'],
			disciplines: ['frontend', 'backend', 'ai-ml'],
			startsOpen: true
		},
		{
			role: 'Data and Analytics Intern',
			organization: 'TVS Credit Services',
			period: 'Jun to Jul 2024',
			highlights: [
				'Wrote Python automation scripts to parse, extract and chunk unstructured enterprise manuals, improving text processing speed by 25% for a generative AI chatbot.'
			],
			technologies: ['Python', 'Generative AI'],
			disciplines: ['ai-ml', 'backend']
		},
		{
			role: 'Software Backend Intern',
			organization: 'Vividobots Pvt. Ltd.',
			period: 'Aug to Oct 2023',
			highlights: [
				'Built scalable backend microservices with Django and Flask, and integrated a HAAR cascade AI model to automate painting tasks.'
			],
			technologies: ['Python', 'Django', 'Flask', 'HAAR cascade', 'Microservices'],
			disciplines: ['backend', 'ai-ml']
		}
	]
};
