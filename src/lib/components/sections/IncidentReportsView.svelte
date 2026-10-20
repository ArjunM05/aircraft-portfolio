<script lang="ts">
	import IncidentCard from '#lib/components/IncidentCard.svelte';
	import type { IncidentReportSection } from '#lib/data/types.js';
	import type { SectionViewProps } from './section-view-props.js';

	let { section, expandAll = false }: SectionViewProps<IncidentReportSection> = $props();
</script>

<div class="card-grid">
	{#each section.reports as report (report.incidentId)}
		<IncidentCard {report} accordionGroup="incidents" {expandAll} />
	{/each}
</div>
