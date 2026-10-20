<script lang="ts">
	import DisciplinePipeline from '#lib/components/DisciplinePipeline.svelte';
	import ProjectCard from '#lib/components/ProjectCard.svelte';
	import SectionLinkList from '#lib/components/SectionLinkList.svelte';
	import TagList from '#lib/components/TagList.svelte';
	import { SHOW_SAMPLE_BADGES } from '#lib/data/site-config.js';
	import type { FrontendSection } from '#lib/data/types.js';
	import type { SectionViewProps } from './section-view-props.js';

	let { section, expandAll = false }: SectionViewProps<FrontendSection> = $props();
</script>

<DisciplinePipeline current="frontend" />
<SectionLinkList heading="Used in" links={section.usedIn} />
<TagList tags={section.technologies} />

<div class="card-grid">
	{#each section.projects as project (project.title)}
		<ProjectCard caseStudy={project} accordionGroup="frontend" {expandAll} />
	{/each}
</div>

<h3>
	How I build interfaces
	{#if SHOW_SAMPLE_BADGES}<span class="sample-badge">sample data</span>{/if}
</h3>
<ul class="bullet-list">
	{#each section.principles as principle (principle)}
		<li>{principle}</li>
	{/each}
</ul>
