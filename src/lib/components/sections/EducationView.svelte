<script lang="ts">
	import type { EducationSection } from '#lib/data/types.js';
	import type { SectionViewProps } from './section-view-props.js';

	let { section }: SectionViewProps<EducationSection> = $props();
</script>

<ol class="education-list">
	{#each section.entries as entry (entry.degree + entry.institution)}
		<li class="education-entry">
			<h3>{entry.degree}</h3>
			<p>{entry.institution}</p>
			<p class="meta-text">{entry.period}</p>

			{#if entry.highlights && entry.highlights.length > 0}
				<ul class="bullet-list">
					{#each entry.highlights as highlight (highlight)}
						<li>{highlight}</li>
					{/each}
				</ul>
			{/if}
		</li>
	{/each}
</ol>

<style>
	.education-list {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/* A thin vertical rule links the entries, like a timeline. */
	.education-entry {
		margin: 0 0 6px;
		padding: 0 0 8px 14px;
		border-left: 2px solid var(--grid);
	}

	.education-entry:first-child {
		border-left-color: var(--amber);
	}

	.education-entry h3 {
		margin-top: 12px;
	}
</style>
