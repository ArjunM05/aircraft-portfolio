<script lang="ts">
	import Accordion from '#lib/components/Accordion.svelte';
	import TelemetryBars from '#lib/components/TelemetryBars.svelte';
	import type { TelemetryExtra } from '#lib/data/types.js';
	import type { ExtraViewProps } from './extra-view-props.js';

	let { extra, expandAll = false }: ExtraViewProps<TelemetryExtra> = $props();
</script>

<Accordion title="Telemetry" subtitle={extra.subtitle ?? 'Before and after'} startsOpen={expandAll}>
	<TelemetryBars bars={extra.bars} />
</Accordion>
