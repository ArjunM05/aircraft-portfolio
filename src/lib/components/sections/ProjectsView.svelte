<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import { MediaQuery } from 'svelte/reactivity';
	import ProjectCard from '#lib/components/ProjectCard.svelte';
	import ProjectFilterBar from '#lib/components/ProjectFilterBar.svelte';
	import type { ProjectsSection } from '#lib/data/types.js';
	import { useExplorer } from '#lib/explorer-context.js';
	import type { SectionViewProps } from './section-view-props.js';

	let { section, expandAll = false }: SectionViewProps<ProjectsSection> = $props();

	const explorer = useExplorer();
	const prefersReducedMotion = new MediaQuery('prefers-reduced-motion: reduce', false);

	const visibleProjects = $derived(
		section.projects.filter((project) => explorer.matchesProject(project))
	);
	const animationMs = $derived(prefersReducedMotion.current ? 0 : 250);
</script>

<ProjectFilterBar projects={section.projects} visibleCount={visibleProjects.length} />

{#if visibleProjects.length === 0}
	<p class="meta-text">
		No project matches these filters.
		<button type="button" class="action-button" onclick={() => explorer.clearProjectFilters()}>
			Clear filters
		</button>
	</p>
{/if}

<div class="card-grid">
	{#each visibleProjects as project (project.title)}
		<div
			class="card-slot"
			animate:flip={{ duration: animationMs }}
			in:fade|local={{ duration: animationMs }}
		>
			<ProjectCard caseStudy={project} accordionGroup="projects" {expandAll} />
		</div>
	{/each}
</div>

<p class="meta-text">
	More code:
	<a href={section.githubUrl} target="_blank" rel="noopener noreferrer">github.com/ArjunM05</a>
</p>
