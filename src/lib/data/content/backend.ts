import { githubUrl } from '../profile';
import { veggieVisionTelemetryBars } from '../telemetry-presets';
import type { BackendSection } from '../types';

export const backendSection: BackendSection = {
	kind: 'backend',
	id: 'backend',
	menuLabel: 'Backend',
	title: 'Backend systems',
	aircraftPartName: 'Avionics bay',
	partExplanation:
		'The avionics bay sits below the cockpit and holds the computers that run the aircraft. Backend systems are the same: unseen, and essential.',
	hasSampleContent: true,
	usedIn: [
		{ sectionId: 'experience', label: 'LogiTrans' },
		{ sectionId: 'internships', label: 'Annam.AI, Vividobots' },
		{ sectionId: 'projects', label: 'Shipment platform, VeggieVision' }
	],
	projects: [
		{
			title: 'Shipment tracking API',
			subtitle: 'ASP.NET MVC + PostgreSQL | LogiTrans',
			facts: [
				{
					label: 'Scope',
					text: 'REST APIs that let operators and the Angular front end track shipments.'
				},
				{
					label: 'Design',
					text: 'Controllers validate every input, a service layer holds the business rules, and PostgreSQL queries were tuned from query plans.'
				},
				{
					label: 'Result',
					text: '40% less manual tracking time and 25% better data load efficiency.'
				}
			],
			flowSteps: [],
			technologies: ['C#', 'ASP.NET MVC', 'PostgreSQL', 'REST'],
			disciplines: ['frontend'],
			isSample: true,
			startsOpen: true,
			extras: [
				{
					kind: 'architecture',
					nodes: [
						{
							id: 'angular-ui',
							label: 'Angular UI',
							lane: 'request-path',
							explanation:
								'Angular and TypeScript client. Keeps shipment status in sync with the backend and shows live tracking updates.'
						},
						{
							id: 'rest-api',
							label: 'REST API',
							lane: 'request-path',
							explanation:
								'ASP.NET MVC REST controllers. Acts like fly-by-wire: every input is validated before it can reach the system, and errors come back in one consistent shape.'
						},
						{
							id: 'service-layer',
							label: 'Service layer',
							lane: 'request-path',
							explanation:
								'Service layer holding the shipment business rules, such as valid status transitions and ETA updates.'
						},
						{
							id: 'postgresql',
							label: 'PostgreSQL',
							lane: 'request-path',
							explanation:
								'PostgreSQL. Indexes chosen from query plans on high-volume shipment tables, which improved data load efficiency by 25%.'
						},
						{
							id: 'authentication',
							label: 'Auth',
							lane: 'supporting',
							explanation: 'Authentication and role checks applied before any controller runs.'
						},
						{
							id: 'logging',
							label: 'Logging',
							lane: 'supporting',
							explanation:
								'Structured logs with a correlation ID per request, so one tracking call can be followed end to end.'
						}
					]
				},
				{
					kind: 'request-path',
					hops: [
						{ name: 'API middleware', durationMs: 3 },
						{ name: 'Controller + validation', durationMs: 5 },
						{ name: 'Service layer', durationMs: 9 },
						{ name: 'PostgreSQL query', durationMs: 24 },
						{ name: 'Serialize + respond', durationMs: 4 }
					]
				},
				{ kind: 'api-playground' }
			]
		},
		{
			title: 'Pest-detection inference API',
			subtitle: 'Flask + Supabase | Annam.AI',
			facts: [
				{
					label: 'Scope',
					text: 'Backend REST endpoints for high-throughput image processing with YOLOv11.'
				},
				{
					label: 'Design',
					text: 'A Flask service sits between the React front end and the model, with Supabase behind it.'
				},
				{ label: 'Result', text: 'Minimal latency during real-time evaluations.' }
			],
			flowSteps: ['React + Vite UI', 'Flask REST API', 'YOLOv11 inference', 'Supabase'],
			technologies: ['Python', 'Flask', 'Supabase', 'YOLOv11'],
			disciplines: ['frontend', 'ai-ml'],
			isSample: false
		},
		{
			title: 'VeggieVision prediction API',
			subtitle: 'Python + YOLOv8 | personal project',
			facts: [
				{
					label: 'Scope',
					text: 'A backend API that serves custom YOLOv8 predictions to an Android app.'
				},
				{
					label: 'Result',
					text: '91% accuracy for real-time object detection and weight estimation.'
				}
			],
			flowSteps: ['Android app', 'REST API', 'YOLOv8', 'Weight estimate'],
			technologies: ['Python', 'YOLOv8', 'Android'],
			disciplines: ['ai-ml'],
			isSample: false,
			sourceCodeUrl: githubUrl,
			extras: [{ kind: 'telemetry', bars: veggieVisionTelemetryBars }]
		},
		{
			title: 'Backend microservices',
			subtitle: 'Django + Flask | Vividobots',
			facts: [
				{ label: 'Scope', text: 'Scalable backend microservices built with Django and Flask.' },
				{
					label: 'Result',
					text: 'A HAAR cascade AI model integrated to automate painting tasks.'
				}
			],
			flowSteps: ['Client', 'Django / Flask services', 'HAAR cascade model', 'Painting automation'],
			technologies: ['Python', 'Django', 'Flask'],
			disciplines: ['ai-ml'],
			isSample: false
		}
	]
};
