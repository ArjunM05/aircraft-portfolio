<script lang="ts">
	import Accordion from './Accordion.svelte';
	import CardExtras from './CardExtras.svelte';
	import { SHOW_SAMPLE_BADGES, type IncidentReport } from '#lib/data/sections.js';

	interface Props {
		report: IncidentReport;
		/** Reports with the same group name open one at a time. */
		accordionGroup: string;
		/** Plain view: open every card and let them stay open together. */
		expandAll?: boolean;
	}

	let { report, accordionGroup, expandAll = false }: Props = $props();
</script>

<Accordion
	title="{report.incidentId}: {report.headline}"
	subtitle="{report.severity} / {report.status}"
	groupName={expandAll ? undefined : accordionGroup}
	startsOpen={expandAll || report.startsOpen}
	showSampleBadge={SHOW_SAMPLE_BADGES && report.isSample}
>
	<dl class="incident-report">
		<dt>Summary</dt>
		<dd>{report.summary}</dd>

		<dt>Timeline</dt>
		<dd>
			<ul class="bullet-list">
				{#each report.timeline as entry (entry.time)}
					<li>{entry.time} {entry.event}</li>
				{/each}
			</ul>
		</dd>

		<dt>Probable cause</dt>
		<dd>{report.probableCause}</dd>

		<dt>Contributing factors</dt>
		<dd>{report.contributingFactors}</dd>

		<dt>Corrective actions</dt>
		<dd>
			<ul class="bullet-list">
				{#each report.correctiveActions as action (action)}
					<li>{action}</li>
				{/each}
			</ul>
		</dd>

		<dt>Outcome</dt>
		<dd>{report.outcome}</dd>
	</dl>

	{#if report.extras}
		<CardExtras extras={report.extras} {expandAll} />
	{/if}
</Accordion>

<style>
	.incident-report {
		margin: 6px 0;
	}

	dt {
		margin-top: 10px;
		font: 11px var(--mono);
		color: var(--cyan);
		text-transform: uppercase;
	}

	dd {
		margin: 0;
	}

	.bullet-list {
		margin: 6px 0;
		padding-left: 18px;
	}

	.bullet-list li {
		max-width: 62ch;
		margin: 3px 0;
	}
</style>
