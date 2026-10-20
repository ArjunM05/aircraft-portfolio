<script lang="ts">
	import { analytics } from '#lib/analytics/analytics.js';
	import Accordion from '#lib/components/Accordion.svelte';
	import SectionLinkList from '#lib/components/SectionLinkList.svelte';
	import TagList from '#lib/components/TagList.svelte';
	import TechChips from '#lib/components/TechChips.svelte';
	import { disciplinesToLinks } from '#lib/data/disciplines.js';
	import type { WorkHistorySection } from '#lib/data/types.js';
	import { useExplorer } from '#lib/explorer-context.js';
	import { workEntryCardId } from '#lib/search/portfolio-index.js';
	import type { SectionViewProps } from './section-view-props.js';

	let { section, expandAll = false }: SectionViewProps<WorkHistorySection> = $props();

	const explorer = useExplorer();
</script>

<div class="card-grid">
	{#each section.entries as entry (entry.role + entry.organization)}
		{@const cardId = workEntryCardId(section.id, entry)}
		<Accordion
			title={entry.role}
			subtitle="{entry.organization} | {entry.period}"
			groupName={expandAll ? undefined : section.id}
			startsOpen={expandAll || Boolean(entry.startsOpen)}
			{cardId}
			reveal={explorer.revealedCardId === cardId}
			onrevealed={() => explorer.clearReveal(cardId)}
			onopen={() => analytics.track('card_opened', { card: cardId })}
		>
			{#snippet preview()}
				<TechChips technologies={entry.technologies} />
			{/snippet}

			<ul class="bullet-list">
				{#each entry.highlights as highlight (highlight)}
					<li>{highlight}</li>
				{/each}
			</ul>
			<TagList tags={entry.technologies} />
			<SectionLinkList heading="Flown with" links={disciplinesToLinks(entry.disciplines)} />
		</Accordion>
	{/each}
</div>
