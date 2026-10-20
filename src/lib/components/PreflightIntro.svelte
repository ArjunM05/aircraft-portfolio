<script lang="ts">
	import { onMount } from 'svelte';
	import { profile } from '#lib/data/profile.js';
	import {
		PREFLIGHT_SEEN_STORAGE_KEY,
		preflightChecklist,
		preflightClearance,
		preflightHeading
	} from '#lib/data/preflight-checklist.js';

	/** The checklist and stamp finish by about 3s after the first paint. Measured from page load. */
	const MINIMUM_VISIBLE_MS = 3400;
	/** With reduced motion nothing moves, so the overlay only needs to cover the loading moment. */
	const MINIMUM_VISIBLE_REDUCED_MOTION_MS = 500;
	const LEAVE_DURATION_MS = 600;

	let isDismissed = $state(false);
	let isLeaving = $state(false);

	/** Remembers that the intro played, for this browser tab only. */
	function markIntroSeen() {
		// app.css (animation timing) and the check in app.html both read this attribute.
		document.documentElement.dataset.introSeen = 'true';

		try {
			sessionStorage.setItem(PREFLIGHT_SEEN_STORAGE_KEY, 'true');
		} catch {
			// Storage can be blocked (private mode). The intro may replay on reload, which is harmless.
		}
	}

	function dismiss() {
		if (isDismissed) return;
		isDismissed = true;
		markIntroSeen();
	}

	function startLeaving() {
		if (isLeaving) return;
		isLeaving = true;
		window.setTimeout(dismiss, LEAVE_DURATION_MS + 100);
	}

	onMount(() => {
		// Already seen in this tab: the overlay is hidden by CSS, so just remove it.
		if (document.documentElement.dataset.introSeen) {
			dismiss();
			return;
		}

		// This code only runs once the page has hydrated, so the real layout (phone or desktop)
		// is in place by now. Wait for the checklist to finish, then leave.
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const minimumMs = prefersReducedMotion ? MINIMUM_VISIBLE_REDUCED_MOTION_MS : MINIMUM_VISIBLE_MS;
		const waitMs = Math.max(0, minimumMs - performance.now());

		const timer = window.setTimeout(() => {
			// Two frames, so the hydrated layout has been painted before the overlay fades.
			requestAnimationFrame(() => requestAnimationFrame(startLeaving));
		}, waitMs);

		return () => window.clearTimeout(timer);
	});
</script>

{#if !isDismissed}
	<div class="preflight" class:leaving={isLeaving}>
		<div class="preflight-content" aria-hidden="true">
			<p class="heading">{preflightHeading}</p>
			<p class="subheading">{profile.name} / {profile.jobTitle}</p>

			<ol class="checklist" style:--item-count={preflightChecklist.length}>
				{#each preflightChecklist as item, index (item.label)}
					<li style:--item-index={index}>
						<span>{item.label}</span>
						<span class="item-leader"></span>
						<span class="item-status">{item.status}</span>
					</li>
				{/each}
			</ol>

			<p class="clearance">{preflightClearance}</p>
		</div>

		<div class="runway" aria-hidden="true">
			<svg class="runway-plane" viewBox="0 0 24 24">
				<path
					d="M24 12L16 9L12 1L9 1L11 9L3 9L1 5L0 5L1 12L0 19L1 19L3 15L11 15L9 23L12 23L16 15Z"
				/>
			</svg>
		</div>

		<button type="button" class="skip-button" onclick={dismiss}>Skip intro</button>
	</div>
{/if}

<style>
	/* Timeline of the checklist: runs from 0.5s; the stamp lands at about 2.8s. */
	.preflight {
		--first-item-at: 0.5s;
		--item-gap: 0.45s;

		position: fixed;
		inset: 0;
		z-index: 100;
		display: grid;
		place-items: center;
		padding: 24px;
		background:
			linear-gradient(var(--grid) 1px, transparent 1px) 0 0 / 24px 24px,
			linear-gradient(90deg, var(--grid) 1px, transparent 1px) 0 0 / 24px 24px,
			var(--bg);
	}

	/* The overlay leaves when the page is ready (see onMount), not on a fixed timer. */
	.preflight.leaving {
		animation: leave 0.6s ease-in forwards;
	}

	@keyframes leave {
		to {
			opacity: 0;
			visibility: hidden;
		}
	}

	/* Already seen in this tab (decided in app.html). */
	:global(html[data-intro-seen]) .preflight {
		display: none;
	}

	.preflight-content {
		width: min(440px, 100%);
	}

	.heading {
		margin: 0;
		font: 600 22px var(--mono);
		letter-spacing: 0.12em;
		color: var(--cyan);
		animation: item-in 0.4s ease-out 0.1s backwards;
	}

	.subheading {
		margin: 4px 0 18px;
		font: 12px var(--mono);
		color: var(--dim);
		animation: item-in 0.4s ease-out 0.2s backwards;
	}

	.checklist {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.checklist li {
		display: flex;
		align-items: baseline;
		gap: 8px;
		margin: 12px 0;
		font: 14px var(--mono);
		animation: item-in 0.35s ease-out backwards;
		animation-delay: calc(var(--first-item-at) + var(--item-index) * var(--item-gap));
	}

	.item-leader {
		flex: 1;
		border-bottom: 2px dotted var(--grid);
		transform: translateY(-3px);
	}

	.item-status {
		color: #7ee787;
		animation: status-in 0.3s ease-out backwards;
		animation-delay: calc(var(--first-item-at) + var(--item-index) * var(--item-gap) + 0.3s);
	}

	.clearance {
		display: inline-block;
		margin: 22px 0 0;
		padding: 6px 14px;
		border: 3px solid var(--amber);
		border-radius: 4px;
		color: var(--amber);
		font: 700 18px var(--mono);
		letter-spacing: 0.08em;
		transform: rotate(-3deg);
		animation: stamp 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.2) backwards;
		animation-delay: calc(var(--first-item-at) + var(--item-count) * var(--item-gap) + 0.2s);
	}

	@keyframes item-in {
		from {
			opacity: 0;
			transform: translateX(-12px);
		}
	}

	@keyframes status-in {
		from {
			opacity: 0;
			transform: scale(1.6);
		}
	}

	@keyframes stamp {
		from {
			opacity: 0;
			transform: rotate(-3deg) scale(2.2);
		}
	}

	/* ---------- runway: the plane taxis across, then lifts off ---------- */
	.runway {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 14%;
		border-top: 2px dashed var(--grid);
	}

	.runway-plane {
		position: absolute;
		top: -14px;
		left: 0;
		width: 28px;
		height: 28px;
		fill: var(--amber);
		animation: taxi-and-takeoff 3.2s cubic-bezier(0.45, 0, 0.55, 1) forwards;
	}

	@keyframes taxi-and-takeoff {
		from {
			transform: translateX(-40px);
		}
		80% {
			transform: translateX(70vw) rotate(0deg);
		}
		to {
			transform: translateX(calc(100vw + 40px)) translateY(-70px) rotate(-18deg);
		}
	}

	/* ---------- skip ---------- */
	.skip-button {
		position: absolute;
		right: 16px;
		bottom: 16px;
		padding: 6px 12px;
		background: none;
		border: 1px solid var(--cyan);
		color: var(--cyan);
		font: 12px var(--mono);
		cursor: pointer;
	}

	.skip-button:hover,
	.skip-button:focus-visible {
		background: var(--cyan);
		color: var(--bg);
		outline: none;
	}

	/* ---------- reduced motion: a calm, static checklist that simply fades out ---------- */
	@media (prefers-reduced-motion: reduce) {
		.preflight,
		.preflight * {
			animation: none !important;
		}

		.preflight {
			transition:
				opacity 0.3s,
				visibility 0s 0.3s;
		}

		.preflight.leaving {
			opacity: 0;
			visibility: hidden;
		}

		.runway {
			display: none;
		}
	}
</style>
