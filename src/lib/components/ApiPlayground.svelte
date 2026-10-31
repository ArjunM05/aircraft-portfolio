<script lang="ts" module>
	import type { MockShipment } from '#lib/data/sections.js';

	const MINIMUM_LATENCY_MS = 220;
	const LATENCY_RANGE_MS = 280;

	interface ApiResponse {
		isSuccess: boolean;
		statusText: string;
		requestPath: string;
		latencyMs: number;
		shipment?: MockShipment;
		bodyJson: string;
	}

	interface Props {
		shipments: Record<string, MockShipment>;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';

	let { shipments }: Props = $props();

	const sampleShipmentIds = $derived(Object.keys(shipments));
	const inputId = $props.id();
	// untrack: the first sample id is only the starting value of the input.
	let shipmentIdInput = $state(untrack(() => Object.keys(shipments)[0]));

	// let shipmentIdInput = $state(sampleShipmentIds[0]);
	let apiResponse = $state<ApiResponse | null>(null);
	let isSending = $state(false);

	async function sendRequest(event: SubmitEvent) {
		event.preventDefault();
		if (isSending) return;

		const shipmentId = shipmentIdInput.trim().toUpperCase();
		const latencyMs = Math.round(MINIMUM_LATENCY_MS + Math.random() * LATENCY_RANGE_MS);

		isSending = true;
		await new Promise((resolve) => setTimeout(resolve, latencyMs));

		const shipment: MockShipment | undefined = shipments[shipmentId];

		apiResponse = {
			isSuccess: Boolean(shipment),
			statusText: shipment ? '200 OK' : '404 Not Found',
			requestPath: `GET /api/shipments/${shipmentId}`,
			latencyMs,
			shipment,
			bodyJson: JSON.stringify(
				shipment
					? { id: shipmentId, ...shipment }
					: { error: 'Shipment not found', id: shipmentId },
				null,
				2
			)
		};
		isSending = false;
	}
</script>

<div class="api-playground">
	<p class="meta-text">
		Mock endpoint running in your browser. Try
		{#each sampleShipmentIds as shipmentId, index (shipmentId)}
			<button type="button" class="sample-id" onclick={() => (shipmentIdInput = shipmentId)}>
				{shipmentId}
			</button>{index < sampleShipmentIds.length - 1 ? ', ' : ''}
		{/each}
		or any other ID to see a 404.
	</p>

	<form class="request-row" onsubmit={sendRequest}>
		<label for={inputId}>GET /api/shipments/</label>
		<input
			id={inputId}
			bind:value={shipmentIdInput}
			autocapitalize="characters"
			autocomplete="off"
		/>
		<button type="submit" class="action-button" disabled={isSending}>
			{isSending ? 'Sending...' : 'Send'}
		</button>
	</form>

	<div class="response" aria-live="polite">
		{#if apiResponse}
			<p class="meta-text">
				<span class:success={apiResponse.isSuccess} class:failure={!apiResponse.isSuccess}>
					{apiResponse.statusText}
				</span>
				| {apiResponse.requestPath} | {apiResponse.latencyMs} ms
			</p>

			{#if apiResponse.shipment}
				<div class="route-progress">
					<span>{apiResponse.shipment.origin}</span>
					<div class="route-track">
						<div class="route-fill" style:width="{apiResponse.shipment.progressPercent}%"></div>
					</div>
					<span>{apiResponse.shipment.destination}</span>
				</div>
			{/if}

			<pre>{apiResponse.bodyJson}</pre>
		{/if}
	</div>
</div>

<style>
	.sample-id {
		padding: 0;
		background: none;
		border: 0;
		border-bottom: 1px dashed var(--cyan);
		color: var(--cyan);
		font: inherit;
		cursor: pointer;
	}

	.request-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px;
		margin: 10px 0;
		font: 12px var(--mono);
	}

	input {
		flex: 1;
		min-width: 100px;
		padding: 6px;
		background: #05182f;
		border: 1px solid var(--cyan);
		color: var(--line);
		/* 16px keeps iPhones from zooming in on focus. */
		font: 16px var(--mono);
	}

	.request-row .action-button {
		margin: 0;
		padding: 6px 14px;
	}

	.action-button:disabled {
		opacity: 0.6;
		cursor: wait;
	}

	.success {
		color: #7ee787;
	}

	.failure {
		color: #ff7b72;
	}

	.route-progress {
		display: flex;
		align-items: center;
		gap: 8px;
		margin: 8px 0;
		font: 12px var(--mono);
	}

	.route-track {
		flex: 1;
		height: 6px;
		background: var(--grid);
	}

	.route-fill {
		height: 100%;
		background: var(--amber);
	}

	pre {
		margin: 8px 0;
		padding: 10px;
		overflow: auto;
		background: #05182f;
		border: 1px solid var(--grid);
		font: 12px/1.5 var(--mono);
	}
</style>
