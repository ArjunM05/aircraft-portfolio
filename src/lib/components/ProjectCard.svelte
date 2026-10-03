<script lang="ts">
	import Accordion from './Accordion.svelte';
	import FlowSteps from './FlowSteps.svelte';
	import SectionLinkList from './SectionLinkList.svelte';
	import { useNavigation } from '#lib/navigation-context.js';
	import { disciplinesToLinks, SHOW_SAMPLE_BADGES, type CaseStudy } from '#lib/data/sections.js';

	interface Props {
		caseStudy: CaseStudy;
		/** Cards with the same group name open one at a time. */
		accordionGroup: string;
		/** Plain view: open every card and let them stay open together. */
		expandAll?: boolean;
	}

	let { caseStudy, accordionGroup, expandAll = false }: Props = $props();

	const goToSection = useNavigation();
</script>

<Accordion
	title={caseStudy.title}
	subtitle={caseStudy.subtitle}
	groupName={expandAll ? undefined : accordionGroup}
	startsOpen={expandAll || caseStudy.startsOpen}
	showSampleBadge={SHOW_SAMPLE_BADGES && caseStudy.isSample}
>
	<dl class="fact-list">
		{#each caseStudy.facts as fact (fact.label)}
			<dt>{fact.label}</dt>
			<dd>{fact.text}</dd>
		{/each}
	</dl>

	{#if caseStudy.flowSteps.length > 0}
		<FlowSteps steps={caseStudy.flowSteps} />
	{/if}

	<ul class="tag-list">
		{#each caseStudy.technologies as technology (technology)}
			<li>{technology}</li>
		{/each}
	</ul>

	<div class="card-actions">
		{#if caseStudy.sourceCodeUrl}
			<a class="chip-link" href={caseStudy.sourceCodeUrl} target="_blank" rel="noopener noreferrer">
				Source code
			</a>

			{#if caseStudy.liveDemoUrl}
				<a class="chip-link" href={caseStudy.liveDemoUrl} target="_blank" rel="noopener noreferrer">
					Live demo
				</a>
			{:else}
				<span class="chip-link chip-link--disabled">Live demo soon</span>
			{/if}
		{/if}

		{#if caseStudy.relatedSection}
			{@const relatedSection = caseStudy.relatedSection}
			<button class="chip-link" onclick={() => goToSection(relatedSection.sectionId)}>
				{relatedSection.label}
			</button>
		{/if}
	</div>

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
