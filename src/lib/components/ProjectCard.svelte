<script lang="ts">
	import Accordion from './Accordion.svelte';
	import CardExtras from './CardExtras.svelte';
	import FlowSteps from './FlowSteps.svelte';
	import SectionLinkList from './SectionLinkList.svelte';
	import { disciplinesToLinks } from '#lib/data/disciplines.js';
	import { SHOW_SAMPLE_BADGES } from '#lib/data/site-config.js';
	import type { CaseStudy } from '#lib/data/types.js';
	import { useNavigation } from '#lib/navigation-context.js';
	import { analytics } from '#lib/analytics/analytics.js';
	import { useExplorer } from '#lib/explorer-context.js';
	import { makeCardId } from '#lib/search/portfolio-index.js';
	import TechChips from './TechChips.svelte';

	interface Props {
		caseStudy: CaseStudy;
		/** Cards with the same group name open one at a time. */
		accordionGroup: string;
		/** Plain view: open every card and let them stay open together. */
		expandAll?: boolean;
	}

	let { caseStudy, accordionGroup, expandAll = false }: Props = $props();

	const goToSection = useNavigation();

	const explorer = useExplorer();
	const cardId = $derived(makeCardId(accordionGroup, caseStudy.title));

	const hasActions = $derived(Boolean(caseStudy.sourceCodeUrl || caseStudy.relatedSection));
</script>

<Accordion
	title={caseStudy.title}
	subtitle={caseStudy.subtitle}
	groupName={expandAll ? undefined : accordionGroup}
	startsOpen={expandAll || caseStudy.startsOpen}
	showSampleBadge={SHOW_SAMPLE_BADGES && caseStudy.isSample}
	// showSampleBadge={false}
	{cardId}
	reveal={explorer.revealedCardId === cardId}
	onrevealed={() => explorer.clearReveal(cardId)}
	onopen={() => analytics.track('card_opened', { card: cardId })}
>
	{#snippet preview()}
		<TechChips technologies={caseStudy.technologies} />
	{/snippet}

	{#if caseStudy.facts.length > 0}
		<dl class="fact-list">
			{#each caseStudy.facts as fact (fact.label)}
				<dt>{fact.label}</dt>
				<dd>{fact.text}</dd>
			{/each}
		</dl>
	{/if}

	{#if caseStudy.flowSteps.length > 0}
		<FlowSteps steps={caseStudy.flowSteps} />
	{/if}

	{#if caseStudy.technologies.length > 0}
		<ul class="tag-list">
			{#each caseStudy.technologies as technology (technology)}
				<li>{technology}</li>
			{/each}
		</ul>
	{/if}

	{#if caseStudy.extras}
		<CardExtras extras={caseStudy.extras} {expandAll} />
	{/if}

	{#if hasActions}
		<div class="card-actions">
			{#if caseStudy.sourceCodeUrl}
				<a
					class="chip-link"
					href={caseStudy.sourceCodeUrl}
					target="_blank"
					rel="noopener noreferrer"
				>
					Source code
				</a>

				<!-- {#if caseStudy.liveDemoUrl}
					<a
						class="chip-link"
						href={caseStudy.liveDemoUrl}
						target="_blank"
						rel="noopener noreferrer"
					>
						Live demo
					</a>
				{:else}
					<span class="chip-link chip-link--disabled">Live demo soon</span>
				{/if} -->
			{/if}

			{#if caseStudy.relatedSection}
				{@const relatedSection = caseStudy.relatedSection}
				<button class="chip-link" onclick={() => goToSection(relatedSection.sectionId)}>
					{relatedSection.label}
				</button>
			{/if}
		</div>
	{/if}

	<SectionLinkList heading="Flown with" links={disciplinesToLinks(caseStudy.disciplines)} />
</Accordion>

<style>
	.fact-list {
		margin: 6px 0;
	}

	dt {
		margin-top: 8px;
		font: 11px var(--mono);
		color: var(--cyan);
	}

	dd {
		margin: 0;
	}

	.card-actions {
		margin: 6px 0;
	}
</style>
