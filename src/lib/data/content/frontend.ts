import { flightBoardRows, flightBoardStatuses } from '../demo-data';
import { githubUrl } from '../profile';
import type { FrontendSection } from '../types';

export const frontendSection: FrontendSection = {
	kind: 'frontend',
	id: 'frontend',
	menuLabel: 'Frontend',
	title: 'Frontend',
	aircraftPartName: 'Passenger cabin',
	partExplanation:
		'The passenger cabin is everything passengers see and touch. Frontend is the same: the interface people actually experience.',
	hasSampleContent: true,
	technologies: ['Angular', 'TypeScript', 'React', 'Vite', 'Svelte', 'JavaScript', 'HTML', 'CSS'],
	usedIn: [
		{ sectionId: 'experience', label: 'LogiTrans' },
		{ sectionId: 'internships', label: 'Annam.AI' },
		{ sectionId: 'projects', label: 'Shipment platform' }
	],
	projects: [
		{
			title: 'Real-time shipment dashboard',
			subtitle: 'Angular + TypeScript | LogiTrans',
			facts: [
				{
					label: 'Scope',
					text: 'Dynamic modules that keep shipment status in sync with backend services.'
				},
				{ label: 'Result', text: 'Operators see changes without refreshing.' }
			],
			flowSteps: [],
			technologies: ['Angular', 'TypeScript'],
			disciplines: ['backend'],
			isSample: false,
			extras: [{ kind: 'flight-board', rows: flightBoardRows, statuses: flightBoardStatuses }],
			startsOpen: true
		},
		{
			title: 'Pest-detection interface',
			subtitle: 'React + Vite | Annam.AI',
			facts: [
				{ label: 'Scope', text: 'A React and Vite interface connected to ML inference APIs.' },
				{ label: 'Result', text: 'Minimal latency during real-time pest-detection evaluations.' }
			],
			flowSteps: ['React + Vite UI', 'Flask API', 'YOLOv11 model'],
			technologies: ['React', 'Vite', 'JavaScript'],
			disciplines: ['backend', 'ai-ml'],
			isSample: false
		},
		{
			title: 'This portfolio',
			subtitle: 'Svelte + SvelteKit | personal project',
			facts: [
				{
					label: 'Problem',
					text: 'Show backend, frontend and AI/ML work without a wall of text.'
				},
				{
					label: 'Approach',
					text: 'Typed content data, Svelte components, and an SVG blueprint with an eased camera.'
				},
				{
					label: 'Result',
					text: 'A static site with a plain-view fallback and a contact form that needs no server.'
				}
			],
			flowSteps: ['Typed content data', 'Svelte components', 'SVG blueprint', 'Static site'],
			technologies: ['Svelte', 'SvelteKit', 'TypeScript', 'SVG', 'CSS'],
			disciplines: [],
			isSample: false,
			sourceCodeUrl: githubUrl
		}
	],
	principles: [
		'Typed API clients, so the UI and the API cannot quietly drift apart.',
		'Small reusable components with clear inputs and outputs.',
		'Responsive and keyboard-accessible by default.',
		'Loading, empty and error states designed up front.'
	]
};
