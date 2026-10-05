<script lang="ts">
	import Accordion from './Accordion.svelte';
	import ApiPlayground from './ApiPlayground.svelte';
	import ArchitectureSchematic from './ArchitectureSchematic.svelte';
	import FlightBoard from './FlightBoard.svelte';
	import FlowSteps from './FlowSteps.svelte';
	import RequestPath from './RequestPath.svelte';
	import SectionLinkList from './SectionLinkList.svelte';
	import TelemetryBars from './TelemetryBars.svelte';
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

	const hasActions = $derived(Boolean(caseStudy.sourceCodeUrl || caseStudy.relatedSection));
</script>

<Accordion
	title={caseStudy.title}
	subtitle={caseStudy.subtitle}
	groupName={expandAll ? undefined : accordionGroup}
	startsOpen={expandAll || caseStudy.startsOpen}
	showSampleBadge={SHOW_SAMPLE_BADGES && caseStudy.isSample}
>
	{#if caseStudy.facts.length > 0}
		<dl class="fact-list">
			{#each caseStudy.facts as fact (fact.label)}
				<dt>{fact.label}</dt>
				<dd>{fact.text}</dd>
			{/each}
		</dl>
	{/if}

	{#if caseStudy.showsFlightBoard}
		<FlightBoard />
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

	{#if caseStudy.architectureNodes}
		<Accordion title="System schematic" subtitle="Tap a node" startsOpen={expandAll}>
			<ArchitectureSchematic nodes={caseStudy.architectureNodes} />
		</Accordion>
	{/if}

	{#if caseStudy.requestHops}
		<Accordion
			title="Request flight path"
			subtitle="One request, hop by hop"
			startsOpen={expandAll}
		>
			<RequestPath hops={caseStudy.requestHops} />
		</Accordion>
	{/if}

	{#if caseStudy.hasApiPlayground}
		<Accordion title="Try the API" subtitle="Mock shipment tracker" startsOpen={expandAll}>
			<ApiPlayground />
		</Accordion>
	{/if}

	{#if caseStudy.telemetryBars}
		<Accordion title="Telemetry" subtitle="Before and after" startsOpen={expandAll}>
			<TelemetryBars bars={caseStudy.telemetryBars} />
		</Accordion>
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

				{#if caseStudy.liveDemoUrl}
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
				{/if}
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
