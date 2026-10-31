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

/** The three engineering disciplines. Each one is also a section id. */
export type Discipline = Extract<SectionId, 'frontend' | 'backend' | 'ai-ml'>;

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
	/** Technologies used in this role. Drives skill evidence, tile previews and search. */
	technologies: string[];
	disciplines: Discipline[];
	startsOpen?: boolean;
}

export interface FlightBoardRow {
	shipmentId: string;
	route: string;
	initialStatus: string;
}

export interface Certification {
	name: string;
	/** Who issued it, for example "Udemy" or "NPTEL". */
	issuer?: string;
	/** Link to the certificate or its verification page. Leave it out when there isn't one. */
	url?: string;
}

/* ---------- optional add-ons for a card ---------- */

export interface TelemetryExtra {
	kind: 'telemetry';
	bars: TelemetryBar[];
	/** Text under the "Telemetry" title. Defaults to "Before and after". */
	subtitle?: string;
}

export interface ArchitectureExtra {
	kind: 'architecture';
	nodes: ArchitectureNode[];
}

export interface RequestPathExtra {
	kind: 'request-path';
	hops: RequestHop[];
}

export interface ApiPlaygroundExtra {
	kind: 'api-playground';
	shipments: Record<string, MockShipment>;
}

export interface FlightBoardExtra {
	kind: 'flight-board';
	rows: FlightBoardRow[];
	statuses: string[];
}

/** Everything a card can show below its text. A card lists the ones it wants, in order. */
export type CardExtra =
	TelemetryExtra | ArchitectureExtra | RequestPathExtra | ApiPlaygroundExtra | FlightBoardExtra;

/** One project, system, engagement or study. Shown by ProjectCard.svelte. */
export interface CaseStudy {
	title: string;
	subtitle: string;
	facts: LabelledText[]; // Problem / Approach / Result, Data / Model / Result, and so on
	flowSteps: string[]; // small flow diagram; empty array hides it
	technologies: string[];
	disciplines: Discipline[];
	isSample?: boolean;
	sourceCodeUrl?: string;
	liveDemoUrl?: string; // when missing, a disabled "Live demo soon" chip is shown
	relatedSection?: SectionLink;
	startsOpen?: boolean;
	extras?: CardExtra[];
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
	/** Optional add-ons, such as before/after telemetry. */
	extras?: CardExtra[];
}

/* =====================================================================
 * Section types (a union keyed by `kind`)
 * ===================================================================== */

interface SectionBase {
	id: SectionId;
	menuLabel: string;
	title: string;
	aircraftPartName: string;
	partExplanation: string;
	hasSampleContent: boolean;
}

export interface IntroSection extends SectionBase {
	kind: 'intro';
	jobTitle: string;
	tagline: string;
	gauges?: GaugeReading[];
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
	certifications: Certification[];
}

export interface EducationEntry {
	degree: string;
	institution: string;
	period: string;
	/** Optional extra lines, such as a grade, coursework or an award. */
	highlights?: string[];
}

export interface EducationSection extends SectionBase {
	kind: 'education';
	entries: EducationEntry[];
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
