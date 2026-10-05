/** Set to false to hide every "sample data" badge once the real content is in place. */
export const SHOW_SAMPLE_BADGES = true;

/* =====================================================================
 * Shared types
 * ===================================================================== */

export type SectionId =
	| 'intro'
	| 'experience'
	| 'internships'
	| 'freelance'
	| 'frontend'
	| 'backend'
	| 'ai-ml'
	| 'skills'
	| 'projects'
	| 'incident-report'
	| 'certifications'
	| 'education'
	| 'contact';

export type AircraftPartId =
	| 'cockpit'
	| 'fuselage'
	| 'flaps'
	| 'winglets'
	| 'passenger-cabin'
	| 'avionics-bay'
	| 'engines'
	| 'wings'
	| 'cargo-hold'
	| 'black-box'
	| 'ailerons'
	| 'elevators'
	| 'rudder';

/** The three engineering disciplines. Each one is also a section id. */
export type Discipline = Extract<SectionId, 'frontend' | 'backend' | 'ai-ml'>;

export const disciplineLabels: Record<Discipline, string> = {
	frontend: 'Frontend',
	backend: 'Backend',

	'ai-ml': 'AI / ML'
};

/** Where the blueprint camera looks. Coordinates are in the 400 x 640 SVG viewBox. */
export interface CameraTarget {
	centerX: number;
	centerY: number;
	zoom: number;
}

export interface SectionLink {
	sectionId: SectionId;
	label: string;
}

export interface GaugeReading {
	percent: number; // 0 to 100, controls how much of the arc is filled
	displayValue: string;
	label: string;
}

export interface LabelledText {
	label: string;
	text: string;
}

/** One job or internship. */
export interface WorkEntry {
	role: string;
	organization: string;
	period: string;
	highlights: string[];
	disciplines: Discipline[];
	startsOpen?: boolean;
}

/** One project, system, engagement or study. Shown by ProjectCard.svelte. */
export interface CaseStudy {
	title: string;
	subtitle: string;
	facts: LabelledText[]; // Problem / Approach / Result, Data / Model / Result, and so on
	flowSteps: string[]; // small flow diagram; empty array hides it
	technologies: string[];
	disciplines: Discipline[];
	isSample: boolean;
	sourceCodeUrl?: string;
	liveDemoUrl?: string; // when missing, a disabled "Live demo soon" chip is shown
	relatedSection?: SectionLink;
	startsOpen?: boolean;

	// Optional extras: a card only shows the ones it has.
	/** Before/after bars. Leave out to hide the Telemetry block. */
	telemetryBars?: TelemetryBar[];
	/** Clickable system diagram. */
	architectureNodes?: ArchitectureNode[];
	/** One request, hop by hop. */
	requestHops?: RequestHop[];
	/** Shows the "Try the API" mock shipment tracker. */
	hasApiPlayground?: boolean;
	/** Shows the simulated live shipment board. */
	showsFlightBoard?: boolean;
}

/* ---------- Backend section pieces ---------- */

export interface ArchitectureNode {
	id: string;
	label: string;
	explanation: string;
	lane: 'request-path' | 'supporting';
}

export interface RequestHop {
	name: string;
	durationMs: number; // bar width is calculated from this in the component
}

export interface TelemetryBar {
	label: string;
	barPercent: number;
	displayValue: string;
}

export interface MockShipment {
	status: string;
	origin: string;
	destination: string;
	weightKg: number;
	flight: string;
	progressPercent: number;
	eta: string;
}

/* ---------- Incident report ---------- */

export interface IncidentReport {
	incidentId: string;
	headline: string;
	severity: string;
	status: string;
	summary: string;
	timeline: { time: string; event: string }[];
	probableCause: string;
	contributingFactors: string;
	correctiveActions: string[];
	outcome: string;
	isSample: boolean;
	startsOpen?: boolean;
	/** Optional before/after bars for the incident. */
	telemetryBars?: TelemetryBar[];
}

/* =====================================================================
 * Section types (a union keyed by `kind`)
 * ===================================================================== */

interface SectionBase {
	id: SectionId;
	menuLabel: string;
	title: string;
	aircraftPart: AircraftPartId;
	aircraftPartName: string;
	partExplanation: string;
	camera: CameraTarget;
	hasSampleContent: boolean;
}

export interface IntroSection extends SectionBase {
	kind: 'intro';
	jobTitle: string;
	tagline: string;
	gauges: GaugeReading[];
	biography: string[];
	exploreLinks: SectionLink[];
}

export interface WorkHistorySection extends SectionBase {
	kind: 'work-history'; // used by both Experience and Internships
	entries: WorkEntry[];
}

export interface FreelanceSection extends SectionBase {
	kind: 'freelance';
	engagements: CaseStudy[];
	workingTerms: string[];
	callToActionLabel: string;
}

export interface FrontendSection extends SectionBase {
	kind: 'frontend';
	technologies: string[];
	usedIn: SectionLink[];
	projects: CaseStudy[];
	principles: string[];
}

export interface BackendSection extends SectionBase {
	kind: 'backend';
	usedIn: SectionLink[];
	projects: CaseStudy[];
}

export interface AiMlSection extends SectionBase {
	kind: 'ai-ml';
	technologies: string[];
	usedIn: SectionLink[];
	gauges: GaugeReading[];
	projects: CaseStudy[];
}

export interface IncidentReportSection extends SectionBase {
	kind: 'incident-report';
	reports: IncidentReport[];
}

export interface SkillsSection extends SectionBase {
	kind: 'skills';
	groups: { name: string; skills: string[] }[];
}

export interface ProjectsSection extends SectionBase {
	kind: 'projects';
	projects: CaseStudy[];
	githubUrl: string;
}

export interface CertificationsSection extends SectionBase {
	kind: 'certifications';
	certifications: string[];
}

export interface EducationSection extends SectionBase {
	kind: 'education';
	degree: string;
	institution: string;
	period: string;
}

export interface ContactSection extends SectionBase {
	kind: 'contact';
	boardingPass: {
		airlineName: string;
		inquiryTypes: string[];
		destinationCode: string;
		destinationName: string;
		flightCode: string;
		gate: string;
		seat: string;
		boardingStatus: string;
	};
	profileLinks: { label: string; url: string }[];
}

export type Section =
	| IntroSection
	| WorkHistorySection
	| FreelanceSection
	| FrontendSection
	| BackendSection
	| AiMlSection
	| SkillsSection
	| ProjectsSection
	| IncidentReportSection
	| CertificationsSection
	| EducationSection
	| ContactSection;

/* =====================================================================
 * Profile and shared demo data
 * ===================================================================== */

const githubUrl = 'https://github.com/ArjunM05';

const asdTelemetryBars: TelemetryBar[] = [
	{ label: 'Detection accuracy', barPercent: 98, displayValue: '98%' }
];

// +18% F1 means the baseline is about 85% as long as the fused result.
const sentimentTelemetryBars: TelemetryBar[] = [
	{ label: 'F1-score, single-modality baseline', barPercent: 85, displayValue: 'baseline' },
	{ label: 'F1-score with multimodal fusion (+18%)', barPercent: 100, displayValue: '+18%' }
];

const veggieVisionTelemetryBars: TelemetryBar[] = [
	{ label: 'Real-time detection accuracy', barPercent: 91, displayValue: '91%' }
];

export const profile = {
	name: 'Arjun M',
	jobTitle: 'Full Stack Software Developer',
	tagline:
		'Building scalable backend architectures and integrating intelligent machine learning pipelines.',
	location: 'Chennai, India',
	email: 'arjunm.0510@gmail.com',
	githubUrl,
	linkedinUrl: 'https://www.linkedin.com/in/arjun-m-803677250/',
	resumeUrl: '/resume.pdf',
	resumeFileName: 'Arjun_M_Resume.pdf'
} as const;

/** Rows for the simulated live shipment board (FlightBoard.svelte). */
export const flightBoardRows = [
	{ shipmentId: 'LT-1042', route: 'MAA-DXB', initialStatus: 'BOARDING' },
	{ shipmentId: 'LT-2088', route: 'BLR-SIN', initialStatus: 'IN TRANSIT' },
	{ shipmentId: 'LT-3150', route: 'DEL-FRA', initialStatus: 'IN TRANSIT' },
	{ shipmentId: 'LT-4471', route: 'BOM-LHR', initialStatus: 'ARRIVING' }
];

export const flightBoardStatuses = [
	'BOARDING',
	'IN TRANSIT',
	'ARRIVING',
	'DELIVERED',
	'CUSTOMS HOLD'
];

/** Fake database for the "Try the API" demo in the Backend section. */
export const mockShipments: Record<string, MockShipment> = {
	'LT-1042': {
		status: 'IN_TRANSIT',
		origin: 'MAA',
		destination: 'DXB',
		weightKg: 1280,
		flight: 'LT201',
		progressPercent: 64,
		eta: '2026-10-05T14:30:00Z'
	},
	'LT-2088': {
		status: 'DELIVERED',
		origin: 'BLR',
		destination: 'SIN',
		weightKg: 420,
		flight: 'LT318',
		progressPercent: 100,
		eta: '2026-10-02T09:10:00Z'
	},
	'LT-3150': {
		status: 'CUSTOMS_HOLD',
		origin: 'DEL',
		destination: 'FRA',
		weightKg: 2150,
		flight: 'LT772',
		progressPercent: 88,
		eta: '2026-10-06T06:45:00Z'
	}
};

/* =====================================================================
 * Sections, in menu order
 * ===================================================================== */

const allSections: Section[] = [
	{
		kind: 'intro',
		id: 'intro',
		menuLabel: 'Intro',
		title: profile.name,
		aircraftPart: 'cockpit',
		aircraftPartName: 'Cockpit',
		partExplanation:
			'The cockpit is where the crew flies the aircraft from, and where every flight begins. Meet the pilot of this one.',
		camera: { centerX: 200, centerY: 306, zoom: 1 },
		hasSampleContent: false,
		jobTitle: profile.jobTitle,
		tagline: profile.tagline,
		gauges: [
			{ percent: 40, displayValue: '-40%', label: 'Manual tracking time' },
			{ percent: 25, displayValue: '+25%', label: 'Data load efficiency' },
			{ percent: 98, displayValue: '98%', label: 'Detection accuracy' }
		],
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
	},
	{
		kind: 'work-history',
		id: 'experience',
		menuLabel: 'Experience',
		title: 'Experience',
		aircraftPart: 'fuselage',
		aircraftPartName: 'Fuselage',
		partExplanation:
			'The fuselage is the main body that holds the crew, cargo and every other part together. Full-time work is what holds a career together.',
		camera: { centerX: 200, centerY: 230, zoom: 1.5 },
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
				disciplines: ['frontend', 'backend'],
				startsOpen: true
			}
		]
	},
	{
		kind: 'work-history',
		id: 'internships',
		menuLabel: 'Interns',
		title: 'Internships',
		aircraftPart: 'flaps',
		aircraftPartName: 'Flaps',
		partExplanation:
			"Flaps extend from the wing's trailing edge to add lift at low speed, like at takeoff. Internships gave my career its first lift.",
		camera: { centerX: 270, centerY: 320, zoom: 3 },
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
				disciplines: ['ai-ml', 'backend']
			},
			{
				role: 'Software Backend Intern',
				organization: 'Vividobots Pvt. Ltd.',
				period: 'Aug to Oct 2023',
				highlights: [
					'Built scalable backend microservices with Django and Flask, and integrated a HAAR cascade AI model to automate painting tasks.'
				],
				disciplines: ['backend', 'ai-ml']
			}
		]
	},
	{
		kind: 'freelance',
		id: 'freelance',
		menuLabel: 'Freelance',
		title: 'Freelance work',
		aircraftPart: 'winglets',
		aircraftPartName: 'Winglets',
		partExplanation:
			'Winglets are add-ons at the wingtips that improve efficiency without changing the aircraft. Freelance work is my extra mile.',
		camera: { centerX: 394, centerY: 345, zoom: 4 },
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
	},
	{
		kind: 'frontend',
		id: 'frontend',
		menuLabel: 'Frontend',
		title: 'Frontend',
		aircraftPart: 'passenger-cabin',
		aircraftPartName: 'Passenger cabin',
		partExplanation:
			'The passenger cabin is everything passengers see and touch. Frontend is the same: the interface people actually experience.',
		camera: { centerX: 200, centerY: 198, zoom: 2.6 },
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
				showsFlightBoard: true,
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
	},
	{
		kind: 'backend',
		id: 'backend',
		menuLabel: 'Backend',
		title: 'Backend systems',
		aircraftPart: 'avionics-bay',
		aircraftPartName: 'Avionics bay',
		partExplanation:
			'The avionics bay sits below the cockpit and holds the computers that run the aircraft. Backend systems are the same: unseen, and essential.',
		camera: { centerX: 200, centerY: 110, zoom: 3 },
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
				architectureNodes: [
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
				],
				requestHops: [
					{ name: 'API middleware', durationMs: 3 },
					{ name: 'Controller + validation', durationMs: 5 },
					{ name: 'Service layer', durationMs: 9 },
					{ name: 'PostgreSQL query', durationMs: 24 },
					{ name: 'Serialize + respond', durationMs: 4 }
				],
				hasApiPlayground: true
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
				telemetryBars: veggieVisionTelemetryBars
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
				flowSteps: [
					'Client',
					'Django / Flask services',
					'HAAR cascade model',
					'Painting automation'
				],
				technologies: ['Python', 'Django', 'Flask'],
				disciplines: ['ai-ml'],
				isSample: false
			}
		]
	},
	{
		kind: 'ai-ml',
		id: 'ai-ml',
		menuLabel: 'AI/ML',
		title: 'AI and machine learning',
		aircraftPart: 'engines',
		aircraftPartName: 'Engines',
		partExplanation:
			'Engines turn fuel into thrust. Machine learning turns data into predictions and powers everything else on board.',
		camera: { centerX: 290, centerY: 284, zoom: 3.4 },
		hasSampleContent: false,
		technologies: [
			'Python',
			'PyTorch',
			'YOLOv8',
			'YOLOv11',
			'RNN',
			'LSTM',
			'CNN',
			'Attention networks',
			'Random Forest',
			'HAAR cascades'
		],
		usedIn: [
			{ sectionId: 'internships', label: 'Annam.AI, TVS Credit, Vividobots' },
			{ sectionId: 'projects', label: 'ASD, Sentiment, VeggieVision' }
		],
		gauges: [
			{ percent: 98, displayValue: '98%', label: 'ASD detection accuracy' },
			{ percent: 18, displayValue: '+18%', label: 'F1 from multimodal fusion' },
			{ percent: 91, displayValue: '91%', label: 'VeggieVision accuracy' }
		],
		projects: [
			{
				title: 'From model to production',
				subtitle: 'Training to client, end to end',
				facts: [
					{
						label: 'Idea',
						text: 'A model is only useful when something can call it. The model is AI/ML, the API is backend and the client is frontend.'
					}
				],
				flowSteps: [
					'Train (PyTorch / YOLO)',
					'Model artifact',
					'Flask inference API',
					'React or Android client'
				],
				technologies: [],
				disciplines: ['backend', 'frontend'],
				isSample: false,
				startsOpen: true
			},
			{
				title: 'Autism Spectrum Disorder Detection',
				subtitle: 'Attention networks | 98% accuracy',
				facts: [
					{ label: 'Data', text: 'Patient MRI scans.' },
					{
						label: 'Model',
						text: 'Custom attention networks extract features, and a random forest ensemble makes the prediction.'
					},
					{ label: 'Result', text: '98% detection accuracy.' }
				],
				flowSteps: ['MRI scans', 'Attention network', 'Random forest', 'Prediction'],
				technologies: ['Python', 'PyTorch', 'Random Forest', 'Deep Learning'],
				disciplines: [],
				isSample: false,
				sourceCodeUrl: githubUrl,
				telemetryBars: asdTelemetryBars
			},
			{
				title: 'Multimodal Sentiment Analysis',
				subtitle: 'RNN, LSTM, CNN | +18% F1-score',
				facts: [
					{
						label: 'Data',
						text: 'Text, audio and video inputs synchronized for real-time model inference.'
					},
					{ label: 'Model', text: 'RNN, LSTM and CNN models combined with feature fusion.' },
					{ label: 'Result', text: 'F1-score up 18% over single-modality models.' }
				],
				flowSteps: ['Text (LSTM)', 'Audio (RNN)', 'Video (CNN)', 'Feature fusion', 'Sentiment'],
				technologies: ['Python', 'RNN', 'LSTM', 'CNN'],
				disciplines: [],
				isSample: false,
				sourceCodeUrl: githubUrl,
				telemetryBars: sentimentTelemetryBars
			},
			{
				title: 'Pest detection with YOLOv11',
				subtitle: 'Computer vision | Annam.AI',
				facts: [
					{ label: 'Data', text: 'Images submitted through the web application.' },
					{ label: 'Model', text: 'YOLOv11 for real-time detection.' },
					{ label: 'Serving', text: 'Flask REST endpoints consumed by a React front end.' }
				],
				flowSteps: ['Image upload', 'YOLOv11', 'Detections', 'React UI'],
				technologies: ['Python', 'YOLOv11', 'Flask', 'React'],
				disciplines: ['backend', 'frontend'],
				isSample: false
			},
			{
				title: 'VeggieVision detection',
				subtitle: 'YOLOv8 | personal project',
				facts: [
					{ label: 'Data', text: 'Produce photos from an Android app.' },
					{
						label: 'Model',
						text: 'A custom YOLOv8 model for object detection and weight estimation.'
					},
					{ label: 'Result', text: '91% accuracy in real time.' }
				],
				flowSteps: ['Photo', 'YOLOv8', 'Weight estimate'],
				technologies: ['Python', 'YOLOv8', 'Android'],
				disciplines: ['backend'],
				isSample: false,
				sourceCodeUrl: githubUrl,
				telemetryBars: veggieVisionTelemetryBars
			},
			{
				title: 'Data prep for generative AI',
				subtitle: 'Python automation | TVS Credit',
				facts: [
					{ label: 'Data', text: 'Unstructured enterprise manuals.' },
					{
						label: 'Approach',
						text: 'Python scripts parse, extract and chunk the text for a generative AI chatbot.'
					},
					{ label: 'Result', text: '25% faster text processing.' }
				],
				flowSteps: ['Manuals', 'Parse', 'Extract', 'Chunk', 'Chatbot'],
				technologies: ['Python'],
				disciplines: ['backend'],
				isSample: false,
				telemetryBars: [
					{ label: 'Text processing speed, before', barPercent: 80, displayValue: 'baseline' },
					{ label: 'With the automation scripts (+25%)', barPercent: 100, displayValue: '+25%' }
				]
			}
		]
	},
	{
		kind: 'skills',
		id: 'skills',
		menuLabel: 'Skills',
		title: 'Skills',
		aircraftPart: 'wings',
		aircraftPartName: 'Wings',
		partExplanation:
			'Wings generate lift and engines provide thrust. This is the stack that does both.',
		camera: { centerX: 300, centerY: 290, zoom: 1.9 },
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
	},
	{
		kind: 'projects',
		id: 'projects',
		menuLabel: 'Projects',
		title: 'Projects',
		aircraftPart: 'cargo-hold',
		aircraftPartName: 'Cargo hold',
		partExplanation:
			'The cargo hold carries the payload an aircraft exists to deliver. These are things I delivered.',
		camera: { centerX: 200, centerY: 410, zoom: 2.6 },
		hasSampleContent: true,
		githubUrl,
		projects: [
			{
				title: 'Shipment Tracking Platform',
				subtitle: 'LogiTrans | -40% manual tracking time',
				facts: [
					{ label: 'Problem', text: 'Manual shipment tracking was slow and error-prone.' },
					{
						label: 'Approach',
						text: 'REST APIs in ASP.NET MVC and C#, an Angular front end, and PostgreSQL queries tuned from query plans.'
					},
					{
						label: 'Result',
						text: '40% less manual processing and 25% better data load efficiency.'
					}
				],
				flowSteps: ['Angular UI', 'REST API', 'Service layer', 'PostgreSQL'],
				technologies: ['C#', 'ASP.NET MVC', 'Angular', 'PostgreSQL'],
				disciplines: ['frontend', 'backend'],
				isSample: true,
				sourceCodeUrl: githubUrl,
				relatedSection: { sectionId: 'backend', label: 'Systems schematic' },
				startsOpen: true
			},
			{
				title: 'Autism Spectrum Disorder Detection',
				subtitle: '98% detection accuracy',
				facts: [
					{ label: 'Problem', text: 'Screening from MRI scans is slow and subjective.' },
					{
						label: 'Approach',
						text: 'An attention network extracts features and a random forest ensemble classifies them.'
					},
					{ label: 'Result', text: '98% detection accuracy.' }
				],
				flowSteps: ['MRI scans', 'Attention network', 'Random forest', 'Prediction'],
				technologies: ['Python', 'PyTorch', 'Random Forest', 'Deep Learning'],
				disciplines: ['ai-ml'],
				isSample: true,
				sourceCodeUrl: githubUrl
			},
			{
				title: 'Multimodal Sentiment Analysis Pipeline',
				subtitle: '18% F1-score boost',
				facts: [
					{
						label: 'Problem',
						text: 'Single-modality models miss context carried by tone and expression.'
					},
					{
						label: 'Approach',
						text: 'Text, audio and video inputs synchronized and combined with feature fusion.'
					},
					{ label: 'Result', text: 'F1-score up 18% over single-modality models.' }
				],
				flowSteps: ['Text (LSTM)', 'Audio (RNN)', 'Video (CNN)', 'Feature fusion', 'Sentiment'],
				technologies: ['Python', 'RNN', 'LSTM', 'CNN'],
				disciplines: ['ai-ml'],
				isSample: true,
				sourceCodeUrl: githubUrl
			},
			{
				title: 'VeggieVision: API and Weight Estimation App',
				subtitle: '91% real-time accuracy',
				facts: [
					{ label: 'Problem', text: 'Estimating produce weight normally needs a scale.' },
					{
						label: 'Approach',
						text: 'YOLOv8 detects the item and a backend API serves predictions to an Android app.'
					},
					{ label: 'Result', text: '91% accuracy in real-time detection and weight estimation.' }
				],
				flowSteps: ['Android app', 'REST API', 'YOLOv8', 'Weight estimate'],
				technologies: ['Python', 'YOLOv8', 'Android'],
				disciplines: ['ai-ml', 'backend'],
				isSample: true,
				sourceCodeUrl: githubUrl
			}
		]
	},
	{
		kind: 'incident-report',
		id: 'incident-report',
		menuLabel: 'Incident',
		title: 'Incident reports',
		aircraftPart: 'black-box',
		aircraftPartName: 'Black box',
		partExplanation:
			'The flight data recorder, or black box, sits in the tail and records what happened so engineers can learn from it. This is how I write up a bug.',
		camera: { centerX: 200, centerY: 478, zoom: 3.4 },
		hasSampleContent: true,
		reports: [
			{
				incidentId: 'INC-2026-001',
				headline: 'Shipment list endpoint slowed under peak load',
				severity: 'Moderate',
				status: 'Resolved',
				summary:
					'Response times for the shipment list climbed from under a second to several seconds as record volume grew.',
				timeline: [
					{ time: '09:12', event: 'Latency alert fires' },
					{ time: '09:40', event: 'Slow query traced using correlation IDs' },
					{ time: '11:05', event: 'Fix deployed' },
					{ time: '11:30', event: 'Latency back to normal' }
				],
				probableCause:
					'A missing composite index plus an N+1 query pattern when loading tracking history.',
				contributingFactors:
					'No query-plan review in code review, and data volume had outgrown early assumptions.',
				correctiveActions: [
					'Added a composite index on shipment ID and status',
					'Replaced the N+1 pattern with a single joined query',
					'Added slow-query logging and a latency alert',
					'Added a regression test'
				],
				outcome: 'Data load efficiency improved by 25%.',
				isSample: true,
				startsOpen: true,
				telemetryBars: [
					{
						label: 'Shipment list response, during the incident',
						barPercent: 100,
						displayValue: '3.4 s'
					},
					{ label: 'After the fix', barPercent: 18, displayValue: '0.6 s' }
				]
			},
			{
				incidentId: 'INC-2026-002',
				headline: 'Image upload endpoint timed out on large batches',
				severity: 'Moderate',
				status: 'Resolved',
				summary:
					'Uploads of many large images stalled the inference endpoint and some requests timed out.',
				timeline: [
					{ time: '14:05', event: 'Timeout errors reported by testers' },
					{ time: '14:30', event: 'Large uploads identified as the trigger' },
					{ time: '16:10', event: 'Fix deployed' }
				],
				probableCause:
					'Full-size images went straight to the model, so each request held a worker for too long.',
				contributingFactors: 'No upload size limit and no request timeouts.',
				correctiveActions: [
					'Resize images before inference',
					'Added upload size limits and request timeouts',
					'Added a health-check endpoint'
				],
				outcome: 'Large uploads now complete reliably.',
				isSample: true
			},
			{
				incidentId: 'INC-2026-003',
				headline: 'Dashboard showed stale shipment status',
				severity: 'Low',
				status: 'Resolved',
				summary: 'Some operators saw old shipment statuses after an update.',
				timeline: [
					{ time: '10:15', event: 'Operator reports an out-of-date status' },
					{ time: '10:50', event: 'Cached API responses identified' },
					{ time: '12:00', event: 'Fix deployed' }
				],
				probableCause: 'A cached response was served after the shipment record had changed.',
				contributingFactors: 'Cache headers were never reviewed for frequently changing data.',
				correctiveActions: [
					'Set cache headers per endpoint',
					'Refetch status after every update',
					'Added a test for stale data'
				],
				outcome: 'Operators now see the current status after every update.',
				isSample: true
			}
		]
	},
	{
		kind: 'certifications',
		id: 'certifications',
		menuLabel: 'Certs',
		title: 'Certifications',
		aircraftPart: 'ailerons',
		aircraftPartName: 'Ailerons',
		partExplanation:
			'Ailerons sit on the outer wings and roll the aircraft into a turn. Each certification turned my path a few degrees.',
		camera: { centerX: 352, centerY: 350, zoom: 3.2 },
		hasSampleContent: false,
		certifications: [
			'Angular Deep Dive (Udemy)',
			'Python for Data Science (NPTEL)',
			'Introduction to Machine Learning (NPTEL)',
			'Social Networks (NPTEL)'
		]
	},
	{
		kind: 'education',
		id: 'education',
		menuLabel: 'Education',
		title: 'Education',
		aircraftPart: 'elevators',
		aircraftPartName: 'Elevators',
		partExplanation:
			'Elevators on the tail control pitch, raising or lowering the nose. Education is what lifts a person up.',
		camera: { centerX: 260, centerY: 535, zoom: 3 },
		hasSampleContent: false,
		degree: 'B.Tech, Computer Science Engineering',
		institution: 'Vellore Institute of Technology (VIT), Chennai',
		period: '2021 to 2025'
	},
	{
		kind: 'contact',
		id: 'contact',
		menuLabel: 'Contact',
		title: 'Contact',
		aircraftPart: 'rudder',
		aircraftPartName: 'Rudder',
		partExplanation:
			'The rudder on the tail fin steers the nose left or right to set the heading. Tell me where to point next.',
		camera: { centerX: 200, centerY: 545, zoom: 3 },
		hasSampleContent: false,
		boardingPass: {
			airlineName: 'AM AIR',
			inquiryTypes: [
				'Hiring opportunity',
				'Collaboration',
				'Freelance project',
				'Just saying hello'
			],
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
	}
];

/**
 * Sections listed here are left out of the site: menu, scrolling, plain view and links.
 * Their data above is still type-checked. Remove an id from this list to publish it again.
 */
const hiddenSectionIds: SectionId[] = ['freelance', 'incident-report'];

export const sections: Section[] = allSections.filter(
	(section) => !hiddenSectionIds.includes(section.id)
);

/* =====================================================================
 * Helpers
 * ===================================================================== */

/** Position of a section in the menu, or -1 if the id is unknown. */
export function getSectionIndex(sectionId: SectionId): number {
	return sections.findIndex((section) => section.id === sectionId);
}

/** Turns a list of disciplines into links, for the "Flown with" chips. */
export function disciplinesToLinks(disciplines: Discipline[]): SectionLink[] {
	return disciplines.map((discipline) => ({
		sectionId: discipline,
		label: disciplineLabels[discipline]
	}));
}
