<script lang="ts">
	import { untrack } from 'svelte';
	import { fade } from 'svelte/transition';
	import { MediaQuery } from 'svelte/reactivity';
	import Blueprint from '#lib/components/Blueprint.svelte';
	import SectionContent from '#lib/components/SectionContent.svelte';
	import {
		getSectionIndex,
		profile,
		sections,
		type AircraftPartId,
		type SectionId
	} from '#lib/data/sections.js';
	import { usePortfolioState } from '#lib/portfolio-state.svelte.js';

	/** How far the visitor scrolls (in screen heights, as a percentage) to move to the next section. */
	const SCROLL_DISTANCE_PER_SECTION_VH = 55;
	/** Minimum horizontal finger movement that counts as a swipe on phones. */
	const SWIPE_DISTANCE_THRESHOLD_PX = 50;

	const portfolio = usePortfolioState();

	/** On phones the page does not scroll between sections; the visitor taps or swipes instead. */
	const isPhoneLayout = new MediaQuery('max-width: 820px', false);

	/** Aircraft parts that have a visible section behind them. */
	const interactiveParts = sections.map((section) => section.aircraftPart);
	const lastSectionIndex = sections.length - 1;
	const scrollTrackHeight = $derived(
		isPhoneLayout.current
			? 'auto'
			: `calc(100svh - var(--header-height) + ${lastSectionIndex * SCROLL_DISTANCE_PER_SECTION_VH}vh)`
	);

	let swipeStartX: number | null = null;

	function scrollDistancePerSection(): number {
		return (window.innerHeight * SCROLL_DISTANCE_PER_SECTION_VH) / 100;
	}

	/** Scroll position (in pixels) that lands in the middle of a section's scroll range. */
	function scrollPositionForSection(sectionIndex: number): number {
		return sectionIndex === 0 ? 0 : sectionIndex * scrollDistancePerSection() + 2;
	}

	function updateActiveSectionFromScroll() {
		if (isPhoneLayout.current || portfolio.isPlainView) return;

		const nearestSection = Math.round(window.scrollY / scrollDistancePerSection());
		portfolio.activeSectionIndex = Math.min(lastSectionIndex, Math.max(0, nearestSection));
	}

	// Tell the header and every "go to section" chip how this page navigates.
	$effect(() =>
		portfolio.registerNavigator((sectionId: SectionId) => {
			const sectionIndex = getSectionIndex(sectionId);
			if (sectionIndex === -1) return;

			portfolio.activeSectionIndex = sectionIndex;
			if (!isPhoneLayout.current) {
				window.scrollTo({ top: scrollPositionForSection(sectionIndex), behavior: 'auto' });
			}
		})
	);

	// Keep the scroll position matching the active section when the layout type changes
	// (resizing across the phone breakpoint) or when returning from plain view.
	$effect(() => {
		if (portfolio.isPlainView) return;
		const isPhone = isPhoneLayout.current;

		untrack(() => {
			window.scrollTo({
				top: isPhone ? 0 : scrollPositionForSection(portfolio.activeSectionIndex),
				behavior: 'auto'
			});
		});
	});

	function selectAircraftPart(part: AircraftPartId) {
		const matchingSection = sections.find((section) => section.aircraftPart === part);
		if (matchingSection) portfolio.goToSection(matchingSection.id);
	}

	function goToAdjacentSection(direction: 1 | -1) {
		const adjacentSection = sections[portfolio.activeSectionIndex + direction];
		if (adjacentSection) portfolio.goToSection(adjacentSection.id);
	}

	function handleSwipeStart(event: TouchEvent) {
		swipeStartX = event.touches[0].clientX;
	}

	function handleSwipeEnd(event: TouchEvent) {
		if (swipeStartX === null || !isPhoneLayout.current) return;

		const horizontalMovement = event.changedTouches[0].clientX - swipeStartX;
		swipeStartX = null;

		if (Math.abs(horizontalMovement) >= SWIPE_DISTANCE_THRESHOLD_PX) {
			// Swiping left moves forward, like turning a page.
			goToAdjacentSection(horizontalMovement < 0 ? 1 : -1);
		}
	}

	/** Svelte action: listens for finger swipes on an element (phones only, see handleSwipeEnd). */
	function listenForSwipes(element: HTMLElement) {
		element.addEventListener('touchstart', handleSwipeStart, { passive: true });
		element.addEventListener('touchend', handleSwipeEnd, { passive: true });

		return {
			destroy() {
				element.removeEventListener('touchstart', handleSwipeStart);
				element.removeEventListener('touchend', handleSwipeEnd);
			}
		};
	}
</script>

<svelte:head>
	<title>{profile.name} | {profile.jobTitle}</title>
</svelte:head>

<svelte:window onscroll={updateActiveSectionFromScroll} onresize={updateActiveSectionFromScroll} />

<h1 class="visually-hidden">{profile.name}, {profile.jobTitle}</h1>
<p class="visually-hidden" aria-live="polite">
	{portfolio.isPlainView ? 'Showing plain view' : `Showing ${portfolio.activeSection.title}`}
</p>

{#if portfolio.isPlainView}
	<div class="plain-view">
		{#each sections as section (section.id)}
			<section class="plain-section" id="plain-{section.id}">
				<SectionContent {section} expandAll />
			</section>
		{/each}
	</div>
{:else}
	<div class="scroll-track" style:height={scrollTrackHeight}>
		<div class="stage">
			<div class="blueprint-area" use:listenForSwipes>
				<Blueprint
					activePart={portfolio.activeSection.aircraftPart}
					camera={portfolio.activeSection.camera}
					onSelectPart={selectAircraftPart}
					{interactiveParts}
					cropToFit={isPhoneLayout.current}
				/>
			</div>

			<article class="detail-panel" aria-label="Section details">
				{#key portfolio.activeSection.id}
					<div class="panel-scroll" in:fade={{ duration: 180 }}>
						<SectionContent section={portfolio.activeSection} />
					</div>
				{/key}

				<footer class="panel-footer">
					<button
						type="button"
						class="step-button"
						onclick={() => goToAdjacentSection(-1)}
						disabled={portfolio.activeSectionIndex === 0}
					>
						&lsaquo; Prev
					</button>
					<span class="step-counter">{portfolio.activeSectionIndex + 1} / {sections.length}</span>
					<button
						type="button"
						class="step-button"
						onclick={() => goToAdjacentSection(1)}
						disabled={portfolio.activeSectionIndex === lastSectionIndex}
					>
						Next &rsaquo;
					</button>
				</footer>
			</article>

			<div class="title-block" aria-hidden="true">
				DWG <strong>A350-900 / ARJUN-M</strong><br />
				SHEET <strong>{portfolio.activeSectionIndex + 1}/{sections.length}</strong> &nbsp; REV
				<strong>A</strong><br />
				Scroll, or use the menu
			</div>
		</div>
	</div>
{/if}

<style>
	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
		border: 0;
	}

	/* ---------- blueprint view ---------- */
	.scroll-track {
		position: relative;
	}

	.stage {
		position: sticky;
		top: var(--header-height);
		display: grid;
		grid-template-columns: 1fr minmax(340px, 540px);
		height: calc(100svh - var(--header-height));
		overflow: hidden;
		background:
			linear-gradient(var(--grid) 1px, transparent 1px) 0 0 / 24px 24px,
			linear-gradient(90deg, var(--grid) 1px, transparent 1px) 0 0 / 24px 24px,
			var(--bg);
	}

	.blueprint-area {
		min-height: 0;
		overflow: hidden;
	}

	.detail-panel {
		display: flex;
		flex-direction: column;
		min-height: 0;
		margin: 12px 24px 16px 0;
		background: var(--panel);
		border: 1px solid var(--line);
	}

	.panel-scroll {
		flex: 1;
		min-height: 0;
		padding: 20px 26px;
		overflow-y: auto;
		/* Scrolling inside the panel never scrolls the page behind it. */
		overscroll-behavior: contain;
	}

	.panel-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 4px 10px;
		border-top: 1px solid var(--line);
	}

	.step-button {
		padding: 8px 10px;
		background: none;
		border: 0;
		color: var(--line);
		font: 600 15px var(--sans);
		cursor: pointer;
	}

	.step-button:disabled {
		opacity: 0.3;
		cursor: default;
	}

	.step-button:focus-visible {
		outline: 2px solid var(--cyan);
	}

	.step-counter {
		font: 12px var(--mono);
		color: var(--dim);
	}

	.title-block {
		position: absolute;
		left: 12px;
		bottom: 12px;
		padding: 6px 10px;
		background: var(--panel);
		border: 1px solid var(--line);
		font: 11px/1.6 var(--mono);
		color: var(--dim);
	}

	.title-block strong {
		font-weight: 400;
		color: var(--line);
	}

	/* ---------- plain view ---------- */
	.plain-view {
		max-width: 780px;
		margin: 0 auto;
		padding: 16px 16px 80px;
	}

	.plain-section {
		padding: 22px 0;
		border-bottom: 1px solid var(--grid);
		/* Keep the heading clear of the sticky header after scrolling. */
		scroll-margin-top: calc(var(--header-height) + 12px);
	}

	/* ---------- phones ---------- */
	@media (max-width: 820px) {
		.stage {
			grid-template-columns: 1fr;
			grid-template-rows: 27svh minmax(0, 1fr);
		}

		.detail-panel {
			margin: 0 10px 10px;
		}

		.panel-scroll {
			padding: 16px;
		}

		.title-block {
			display: none;
		}
	}
</style>
