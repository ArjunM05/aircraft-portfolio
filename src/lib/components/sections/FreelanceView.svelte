<script lang="ts">
	import ProjectCard from '#lib/components/ProjectCard.svelte';
	import type { FreelanceSection } from '#lib/data/types.js';
	import { useNavigation } from '#lib/navigation-context.js';
	import type { SectionViewProps } from './section-view-props.js';

	let { section, expandAll = false }: SectionViewProps<FreelanceSection> = $props();

	const goToSection = useNavigation();
</script>

<div class="card-grid">
	{#each section.engagements as engagement (engagement.title)}
		<ProjectCard caseStudy={engagement} accordionGroup="freelance" {expandAll} />
	{/each}
</div>

<h3>Working together</h3>
<ul class="bullet-list">
	{#each section.workingTerms as term (term)}
		<li>{term}</li>
	{/each}
</ul>

<button type="button" class="action-button" onclick={() => goToSection('contact')}>
	{section.callToActionLabel}
</button>
