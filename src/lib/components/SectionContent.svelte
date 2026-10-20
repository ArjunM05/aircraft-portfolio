<script lang="ts">
	import type { Component } from 'svelte';
	import SectionHeader from './SectionHeader.svelte';
	import type { SectionViewProps } from './sections/section-view-props.js';
	import { sectionViews } from './sections/section-views.js';
	import type { Section } from '#lib/data/types.js';

	interface Props {
		section: Section;
		/** Plain view: open every accordion and let them stay open together. */
		expandAll?: boolean;
	}

	let { section, expandAll = false }: Props = $props();

	/**
	 * The registry guarantees every kind has a view that takes its own kind of section.
	 * TypeScript cannot follow "this kind picks that view" through a lookup, so we widen once, here.
	 */
	const SectionView = $derived(
		sectionViews[section.kind] as unknown as Component<SectionViewProps>
	);
</script>

<!-- Plain view (expandAll) is a simple document, so the aircraft wording is left out there. -->
<SectionHeader {section} showAircraftContext={!expandAll} />

<div class="section-body">
	<SectionView {section} {expandAll} />
</div>
