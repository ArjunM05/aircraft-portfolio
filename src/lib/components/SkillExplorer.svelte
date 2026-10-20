<script lang="ts">
	import { sections } from '#lib/data/sections.js';
	import { useExplorer } from '#lib/explorer-context.js';
	import { useNavigation } from '#lib/navigation-context.js';
	import { analytics } from '#lib/analytics/analytics.js';
	import {
		countEvidence,
		findSkillEvidence,
		type EvidenceItem
	} from '#lib/search/portfolio-index.js';

	interface Props {
		groups: { name: string; skills: string[] }[];
	}

	let { groups }: Props = $props();

	const explorer = useExplorer();
	const goToSection = useNavigation();

	const evidenceBySkill = $derived(
		new Map(
			groups.flatMap((group) =>
				group.skills.map((skill) => [skill, findSkillEvidence(skill, sections)] as const)
			)
		)
	);

	const selectedSkill = $derived(explorer.selectedSkill);
	const selectedEvidence = $derived(
		selectedSkill
			? (evidenceBySkill.get(selectedSkill) ?? findSkillEvidence(selectedSkill, sections))
			: null
	);
	const canFilterProjects = $derived(
		selectedEvidence?.caseStudies.some((item) => item.sectionId === 'projects') ?? false
	);

	function showOnlyProjectsUsing(skill: string) {
		explorer.showProjectsUsing(skill);
		goToSection('projects');
	}

	function openEvidence(item: EvidenceItem) {
		explorer.revealCard(item.cardId);
		goToSection(item.sectionId);
	}

	function selectSkill(skill: string) {
		explorer.toggleSkill(skill);
		if (explorer.selectedSkill === skill) analytics.track('skill_selected', { skill });
	}
</script>

<section class="evidence-panel" aria-live="polite">
	{#if selectedSkill && selectedEvidence}
		<div class="evidence-header">
			<h3>Where I have used <strong>{selectedSkill}</strong></h3>
			<button type="button" class="close-button" onclick={() => (explorer.selectedSkill = null)}>
				Close
			</button>
		</div>

		{#if countEvidence(selectedEvidence) === 0}
			<p class="meta-text">Not tied to a specific project or job yet.</p>
		{/if}

		{#if selectedEvidence.caseStudies.length > 0}
			<span class="evidence-label">Projects</span>
			{#each selectedEvidence.caseStudies as item (item.sectionId + item.title)}
				<button type="button" class="chip-link" onclick={() => openEvidence(item)}>
					{item.title} &middot; {item.sectionLabel}
				</button>
			{/each}
		{/if}

		{#if selectedEvidence.workEntries.length > 0}
			<span class="evidence-label">Experience</span>
			{#each selectedEvidence.workEntries as item (item.sectionId + item.title)}
				<button type="button" class="chip-link" onclick={() => openEvidence(item)}>
					{item.title}
				</button>
			{/each}
		{/if}

		{#if canFilterProjects}
			<div class="evidence-actions">
				<button
					type="button"
					class="action-button"
					onclick={() => showOnlyProjectsUsing(selectedSkill)}
				>
					Show only {selectedSkill} projects
				</button>
			</div>
		{/if}
	{:else}
		<p class="meta-text">Tap any skill to see the projects and jobs where I used it.</p>
	{/if}
</section>

<div class="skill-groups">
	{#each groups as group (group.name)}
		<div class="skill-group">
			<h3>{group.name}</h3>
			<ul class="skill-chips">
				{#each group.skills as skill (skill)}
					{@const evidenceCount = countEvidence(
						evidenceBySkill.get(skill) ?? { caseStudies: [], workEntries: [] }
					)}
					<li>
						<button
							type="button"
							class="skill-chip"
							class:selected={selectedSkill === skill}
							aria-pressed={selectedSkill === skill}
							onclick={() => selectSkill(skill)}
						>
							{skill}
							{#if evidenceCount > 0}<span class="skill-count">{evidenceCount}</span>{/if}
						</button>
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</div>

<style>
	.evidence-panel {
		min-height: 5.5rem;
		margin: 8px 0 4px;
		padding: 10px 12px;
		border: 1px dashed var(--grid);
	}

	.evidence-header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
	}

	.evidence-header h3 {
		margin: 0 0 6px;
		font-size: 17px;
	}

	.evidence-header strong {
		color: var(--cyan);
	}

	.close-button {
		padding: 2px 8px;
		background: none;
		border: 1px solid var(--grid);
		color: var(--dim);
		font: 11px var(--mono);
		cursor: pointer;
	}

	.close-button:hover {
		color: var(--line);
		border-color: var(--line);
	}

	.evidence-label {
		display: block;
		margin: 6px 0 2px;
		font: 10px var(--mono);
		color: var(--dim);
		text-transform: uppercase;
	}

	.evidence-actions {
		margin-top: 6px;
	}

	.skill-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin: 6px 0;
		padding: 0;
		list-style: none;
	}

	.skill-chip {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 4px 10px;
		background: none;
		border: 1px solid var(--cyan);
		color: inherit;
		font: 12px var(--mono);
		cursor: pointer;
		transition:
			background 0.15s,
			color 0.15s;
	}

	.skill-chip:hover {
		background: var(--grid);
	}

	.skill-chip.selected {
		background: var(--cyan);
		color: var(--bg);
	}

	.skill-chip:focus-visible {
		outline: 2px solid var(--amber);
		outline-offset: 2px;
	}

	.skill-count {
		min-width: 16px;
		padding: 0 4px;
		border-radius: 8px;
		background: var(--amber);
		color: var(--bg);
		font: 600 10px/16px var(--mono);
		text-align: center;
	}
</style>
