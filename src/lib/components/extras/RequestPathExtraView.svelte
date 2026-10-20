<script lang="ts">
	import Accordion from '#lib/components/Accordion.svelte';
	import RequestPath from '#lib/components/RequestPath.svelte';
	import type { RequestPathExtra } from '#lib/data/types.js';
	import type { ExtraViewProps } from './extra-view-props.js';

	let { extra, expandAll = false }: ExtraViewProps<RequestPathExtra> = $props();
</script>

<Accordion title="Request flight path" subtitle="One request, hop by hop" startsOpen={expandAll}>
	<RequestPath hops={extra.hops} />
</Accordion>
