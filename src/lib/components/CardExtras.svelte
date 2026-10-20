<script lang="ts">
	import type { Component } from 'svelte';
	import type { CardExtra } from '#lib/data/types.js';
	import type { ExtraViewProps } from './extras/extra-view-props.js';
	import { extraViews } from './extras/extra-views.js';

	interface Props {
		extras: CardExtra[];
		expandAll?: boolean;
	}

	let { extras, expandAll = false }: Props = $props();
</script>

{#each extras as extra, index (index)}
	<!-- Same one-time widening as SectionContent: the registry already guarantees the pairing. -->
	{@const ExtraView = extraViews[extra.kind] as unknown as Component<ExtraViewProps>}
	<ExtraView {extra} {expandAll} />
{/each}
