<script lang="ts">
	import Accordion from '#lib/components/Accordion.svelte';
	import ArchitectureSchematic from '#lib/components/ArchitectureSchematic.svelte';
	import type { ArchitectureExtra } from '#lib/data/types.js';
	import type { ExtraViewProps } from './extra-view-props.js';

	let { extra, expandAll = false }: ExtraViewProps<ArchitectureExtra> = $props();
</script>

<Accordion title="System schematic" subtitle="Tap a node" startsOpen={expandAll}>
	<ArchitectureSchematic nodes={extra.nodes} />
</Accordion>
