<script lang="ts">
	import DisciplinePipeline from '#lib/components/DisciplinePipeline.svelte';
	import ProjectCard from '#lib/components/ProjectCard.svelte';
	import SectionLinkList from '#lib/components/SectionLinkList.svelte';
	import type { BackendSection } from '#lib/data/types.js';
	import type { SectionViewProps } from './section-view-props.js';

	let { section, expandAll = false }: SectionViewProps<BackendSection> = $props();
</script>

<DisciplinePipeline current="backend" />
<SectionLinkList heading="Used in" links={section.usedIn} />

<div class="card-grid">
	{#each section.projects as project (project.title)}
		<ProjectCard caseStudy={project} accordionGroup="backend" {expandAll} />
	{/each}
</div>
