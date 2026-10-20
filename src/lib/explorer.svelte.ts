import type { Discipline } from '#lib/data/sections.js';
import type { CaseStudy } from '#lib/data/types.js';
import { termsOverlap } from '#lib/search/term-matching.js';

/** How long a reveal request stays valid if no card picks it up. */
const REVEAL_REQUEST_LIFETIME_MS = 3000;

/** What the visitor is currently exploring: a chosen skill, project filters and a card to open. */
export class PortfolioExplorer {
	selectedSkill = $state<string | null>(null);
	technologyFilter = $state<string | null>(null);
	disciplineFilter = $state<Discipline | null>(null);
	/** A card that has been asked to open itself and scroll into view. */
	revealedCardId = $state<string | null>(null);

	get hasProjectFilter(): boolean {
		return this.technologyFilter !== null || this.disciplineFilter !== null;
	}

	matchesProject(project: CaseStudy): boolean {
		const { technologyFilter, disciplineFilter } = this;

		if (disciplineFilter && !project.disciplines.includes(disciplineFilter)) return false;
		if (
			technologyFilter &&
			!project.technologies.some((technology) => termsOverlap(technology, technologyFilter))
		) {
			return false;
		}
		return true;
	}

	toggleSkill(skill: string): void {
		this.selectedSkill = this.selectedSkill === skill ? null : skill;
	}

	toggleTechnology(technology: string): void {
		this.technologyFilter = this.technologyFilter === technology ? null : technology;
	}

	toggleDiscipline(discipline: Discipline): void {
		this.disciplineFilter = this.disciplineFilter === discipline ? null : discipline;
	}

	showProjectsUsing(technology: string): void {
		this.technologyFilter = technology;
		this.disciplineFilter = null;
	}

	clearProjectFilters(): void {
		this.technologyFilter = null;
		this.disciplineFilter = null;
	}

	/** Ask a card to open. Filters are cleared so the card cannot be hidden by one. */
	revealCard(cardId: string): void {
		this.clearProjectFilters();
		this.revealedCardId = cardId;

		window.setTimeout(() => {
			if (this.revealedCardId === cardId) this.revealedCardId = null;
		}, REVEAL_REQUEST_LIFETIME_MS);
	}

	/** Called by the card once it has handled the request. */
	clearReveal(cardId: string): void {
		if (this.revealedCardId === cardId) this.revealedCardId = null;
	}
}
