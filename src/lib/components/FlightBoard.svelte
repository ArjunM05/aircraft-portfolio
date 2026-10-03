<script lang="ts" module>
	const UPDATE_INTERVAL_MS = 2500;
	/** Chance that any single row changes on each update. */
	const STATUS_CHANGE_PROBABILITY = 0.35;
</script>

<script lang="ts">
	import { fly } from 'svelte/transition';
	import { flightBoardRows, flightBoardStatuses } from '#lib/data/sections.js';

	let boardRows = $state(
		flightBoardRows.map((row) => ({
			shipmentId: row.shipmentId,
			route: row.route,
			status: row.initialStatus
		}))
	);

	function pickDifferentStatus(currentStatus: string): string {
		const otherStatuses = flightBoardStatuses.filter((status) => status !== currentStatus);
		return otherStatuses[Math.floor(Math.random() * otherStatuses.length)];
	}

	$effect(() => {
		const intervalId = setInterval(() => {
			for (const row of boardRows) {
				if (Math.random() < STATUS_CHANGE_PROBABILITY) {
					row.status = pickDifferentStatus(row.status);
				}
			}
		}, UPDATE_INTERVAL_MS);

		return () => clearInterval(intervalId);
	});
</script>

<table class="flight-board">
	<caption class="meta-text">
		Simulated live board. Status changes arrive every few seconds, like the dashboard syncing with
		the API.
	</caption>
	<thead>
		<tr>
			<th scope="col">ID</th>
			<th scope="col">Route</th>
			<th scope="col">Status</th>
		</tr>
	</thead>
	<tbody>
		{#each boardRows as row (row.shipmentId)}
			<tr>
				<td>{row.shipmentId}</td>
				<td>{row.route}</td>
				<td class="status-cell">
					{#key row.status}
						<span in:fly={{ y: -6, duration: 400 }}>{row.status}</span>
					{/key}
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	.flight-board {
		width: 100%;
		margin: 8px 0;
		border-collapse: collapse;
		background: #05182f;
		border: 1px solid var(--grid);
		font: 12px var(--mono);
	}

	caption {
		caption-side: bottom;
		padding-top: 6px;
		text-align: left;
	}

	th,
	td {
		padding: 5px 8px;
		text-align: left;
		border-bottom: 1px solid var(--grid);
	}

	th {
		font-weight: 400;
		color: var(--dim);
	}

	.status-cell {
		color: var(--amber);
	}

	.status-cell span {
		display: inline-block;
	}
</style>
