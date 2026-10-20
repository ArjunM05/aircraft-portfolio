<script lang="ts">
	import Accordion from '#lib/components/Accordion.svelte';
	import ApiPlayground from '#lib/components/ApiPlayground.svelte';
	import type { ApiPlaygroundExtra } from '#lib/data/types.js';
	import type { ExtraViewProps } from './extra-view-props.js';

	let { expandAll = false }: ExtraViewProps<ApiPlaygroundExtra> = $props();
</script>

<Accordion title="Try the API" subtitle="Mock shipment tracker" startsOpen={expandAll}>
	<ApiPlayground />
</Accordion>
