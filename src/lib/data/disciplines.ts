import type { Discipline, SectionLink } from './types';

export const disciplineLabels: Record<Discipline, string> = {
	frontend: 'Frontend',
	backend: 'Backend',

	'ai-ml': 'AI / ML'
};

/** Turns a list of disciplines into links, for the "Flown with" chips. */
export function disciplinesToLinks(disciplines: Discipline[]): SectionLink[] {
	return disciplines.map((discipline) => ({
		sectionId: discipline,
		label: disciplineLabels[discipline]
	}));
}
