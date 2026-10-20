import { hiddenSectionIds } from '../site-config';
import type { Section, SectionId } from '../types';
import { aiMlSection } from './ai-ml';
import { backendSection } from './backend';
import { certificationsSection } from './certifications';
import { contactSection } from './contact';
import { educationSection } from './education';
import { freelanceSection } from './freelance';
import { frontendSection } from './frontend';
import { incidentReportsSection } from './incident-reports';
import { introSection } from './intro';
import { projectsSection } from './projects';
import { skillsSection } from './skills';
import { experienceSection, internshipsSection } from './work-history';

/**
 * Every section, in menu order.
 * To add a section: create its file in this folder, then add one line here.
 */
const allSections: Section[] = [
	introSection,
	experienceSection,
	internshipsSection,
	freelanceSection,
	frontendSection,
	backendSection,
	aiMlSection,
	skillsSection,
	projectsSection,
	incidentReportsSection,
	certificationsSection,
	educationSection,
	contactSection
];

/** The sections that are published (everything except the hidden ones). */
export const sections: Section[] = allSections.filter(
	(section) => !hiddenSectionIds.includes(section.id)
);

/** Position of a section in the menu, or -1 if the id is unknown or hidden. */
export function getSectionIndex(sectionId: SectionId): number {
	return sections.findIndex((section) => section.id === sectionId);
}
