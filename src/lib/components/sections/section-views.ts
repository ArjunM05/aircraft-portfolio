import type { Component } from 'svelte';
import type { Section } from '#lib/data/types.js';
import AiMlView from './AiMlView.svelte';
import BackendView from './BackendView.svelte';
import CertificationsView from './CertificationsView.svelte';
import ContactView from './ContactView.svelte';
import EducationView from './EducationView.svelte';
import FreelanceView from './FreelanceView.svelte';
import FrontendView from './FrontendView.svelte';
import IncidentReportsView from './IncidentReportsView.svelte';
import IntroView from './IntroView.svelte';
import ProjectsView from './ProjectsView.svelte';
import type { SectionViewProps } from './section-view-props.js';
import SkillsView from './SkillsView.svelte';
import WorkHistoryView from './WorkHistoryView.svelte';

/** One view per section kind, each receiving exactly its own kind of section. */
type SectionViewRegistry = {
	[Kind in Section['kind']]: Component<SectionViewProps<Extract<Section, { kind: Kind }>>>;
};

/**
 * To add a section kind:
 *   1. add its interface to the Section union in data/types.ts,
 *   2. create its view in this folder,
 *   3. add one line here.
 * TypeScript fails to compile until all three are done.
 */
export const sectionViews: SectionViewRegistry = {
	intro: IntroView,
	'work-history': WorkHistoryView,
	freelance: FreelanceView,
	frontend: FrontendView,
	backend: BackendView,
	'ai-ml': AiMlView,
	skills: SkillsView,
	projects: ProjectsView,
	'incident-report': IncidentReportsView,
	certifications: CertificationsView,
	education: EducationView,
	contact: ContactView
};
