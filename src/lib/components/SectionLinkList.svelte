<script lang="ts">
	import { getSectionIndex, type SectionLink } from '#lib/data/sections.js';
	import { useNavigation } from '#lib/navigation-context.js';

	interface Props {
		/** Small caption above the chips, for example "Flown with" or "Used in". */
		heading: string;
		links: SectionLink[];
	}

	let { heading, links }: Props = $props();

	const goToSection = useNavigation();

	// Links to sections that are currently hidden are left out, so no chip leads nowhere.
	const visibleLinks = $derived(links.filter((link) => getSectionIndex(link.sectionId) !== -1));
</script>

{#if visibleLinks.length > 0}
	<div class="section-link-list">
		<span class="heading">{heading}</span>
		{#each visibleLinks as link (link.sectionId + link.label)}
			<button class="chip-link" onclick={() => goToSection(link.sectionId)}>
				{link.label}
			</button>
		{/each}
	</div>
{/if}

<style>
	.section-link-list {
		margin: 8px 0;
	}

	.heading {
		display: block;
		margin-bottom: 2px;
		font: 10px var(--mono);
		color: var(--dim);
		text-transform: uppercase;
	}
</style>
