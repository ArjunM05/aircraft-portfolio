<script lang="ts">
	import DisciplinePipeline from '#lib/components/DisciplinePipeline.svelte';
	import Gauge from '#lib/components/Gauge.svelte';
	import ProjectCard from '#lib/components/ProjectCard.svelte';
	import SectionLinkList from '#lib/components/SectionLinkList.svelte';
	import TagList from '#lib/components/TagList.svelte';
	import type { AiMlSection } from '#lib/data/types.js';
	import type { SectionViewProps } from './section-view-props.js';

	let { section, expandAll = false }: SectionViewProps<AiMlSection> = $props();
</script>

<DisciplinePipeline current="ai-ml" />
<SectionLinkList heading="Used in" links={section.usedIn} />

<div class="gauge-row">
	{#each section.gauges as gauge (gauge.label)}
		<Gauge percent={gauge.percent} displayValue={gauge.displayValue} label={gauge.label} />
	{/each}
</div>

<TagList tags={section.technologies} />

<div class="card-grid">
	{#each section.projects as project (project.title)}
		<ProjectCard caseStudy={project} accordionGroup="ai-ml" {expandAll} />
	{/each}
</div>
