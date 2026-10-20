<script lang="ts">
	import SkillExplorer from '#lib/components/SkillExplorer.svelte';
	import type { SkillsSection } from '#lib/data/types.js';
	import type { SectionViewProps } from './section-view-props.js';

	let { section }: SectionViewProps<SkillsSection> = $props();
</script>

<SkillExplorer groups={section.groups} />
