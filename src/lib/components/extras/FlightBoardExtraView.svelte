<script lang="ts">
	import FlightBoard from '#lib/components/FlightBoard.svelte';
	import type { FlightBoardExtra } from '#lib/data/types.js';
	import type { ExtraViewProps } from './extra-view-props.js';

	// The board is shown directly in the card, not inside an accordion.
	let {}: ExtraViewProps<FlightBoardExtra> = $props();
</script>

<FlightBoard />
