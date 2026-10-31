<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { fade } from 'svelte/transition';
	import { MediaQuery } from 'svelte/reactivity';
	import { useSectionCursor, useSectionNavigator, useViewMode } from '#lib/app-contexts.js';
	import { analytics } from '#lib/analytics/analytics.js';
	import { findSectionIdForPart, getBlueprintBinding } from '#lib/blueprint/section-bindings.js';
	import type { AircraftPartId } from '#lib/blueprint/types.js';
	import { downloadFile, openInNewTab } from '#lib/browser-helpers.js';
	import Blueprint from '#lib/components/Blueprint.svelte';
	import CommandPalette from '#lib/components/CommandPalette.svelte';
	import InstrumentCluster from '#lib/components/InstrumentCluster.svelte';
	import SectionContent from '#lib/components/SectionContent.svelte';
	import TerminalDialog from '#lib/components/TerminalDialog.svelte';
	import TourBar from '#lib/components/TourBar.svelte';
	import { visitPaths } from '#lib/data/hero.js';
	import { getSectionIndex, profile, sections, type SectionId } from '#lib/data/sections.js';
	import { isExtraAnimationOn } from '#lib/data/site-config.js';
	import { provideExplorer } from '#lib/explorer-context.js';
	import { PortfolioExplorer } from '#lib/explorer.svelte.js';
	import { provideGuidedTour } from '#lib/guided-tour-context.js';
	import { GuidedTour } from '#lib/guided-tour.svelte.js';
	import { BlueprintScroller } from '#lib/navigation/blueprint-scroller.js';
	import { SCROLL_DISTANCE_PER_SECTION_VH } from '#lib/navigation/scroll-geometry.js';
	import { swipe, type SwipeDirection } from '#lib/navigation/swipe.js';
	import { WheelForwarder } from '#lib/navigation/wheel-forwarder.js';
	import { buildPaletteEntries } from '#lib/search/palette-entries.js';
	import { buildTerminalCommands } from '#lib/terminal/commands.js';

	/** What the visitor asked for. "balanced" lets the page switch between takeoff and cruise itself. */
	type LayoutPreference = 'aircraft' | 'balanced' | 'reading';
	/** The layout actually on screen. */
	type StageLayout = 'aircraft' | 'takeoff' | 'cruise' | 'reading';

	const LAYOUT_CHOICES: { value: LayoutPreference; label: string; hint: string }[] = [
		{ value: 'aircraft', label: 'Aircraft', hint: 'Bigger blueprint, smaller text panel' },
		{
			value: 'balanced',
			label: 'Balanced',
			hint: 'Big aircraft on landing, more room for content afterwards'
		},
		{ value: 'reading', label: 'Reading', hint: 'Maximum room for content' }
	];

	// Each of these is a small, separate piece of state created by the layout.
	const viewMode = useViewMode();
	const cursor = useSectionCursor();
	const sectionNavigator = useSectionNavigator();

	const goToSection = (sectionId: SectionId) => sectionNavigator.goTo(sectionId);

	const isPhoneLayout = new MediaQuery('max-width: 820px', false);
	const lastSectionIndex = sections.length - 1;

	// ---------- scrolling and navigation ----------
	const scroller = new BlueprintScroller({
		cursor,
		sectionCount: sections.length,
		findSectionIndex: getSectionIndex,
		isPlainView: () => viewMode.isPlainView,
		isPhoneLayout: () => isPhoneLayout.current
	});

	// Tell the header, flight path and every "go to section" chip how this page navigates.
	$effect(() => sectionNavigator.registerBlueprintNavigation((id) => scroller.goTo(id)));

	// Keep the scroll position matching the active section when the layout type changes
	// (resizing across the phone breakpoint) or when returning from plain view.
	$effect(() => {
		if (viewMode.isPlainView) return;
		const isPhone = isPhoneLayout.current;

		untrack(() => scroller.restoreScrollPosition(isPhone));
	});

	function goToAdjacentSection(direction: SwipeDirection) {
		const adjacentSection = sections[cursor.index + direction];
		if (adjacentSection) goToSection(adjacentSection.id);
	}

	function selectAircraftPart(part: AircraftPartId) {
		const sectionId = findSectionIdForPart(
			part,
			sections.map((section) => section.id)
		);
		if (sectionId) goToSection(sectionId);
	}

	// Lets the content panel scroll on to the next section, like an ordinary page.
	const wheelForwarder = new WheelForwarder({ isEnabled: () => !isPhoneLayout.current });

	// ---------- guided tour and exploring ----------
	const tour = provideGuidedTour(
		new GuidedTour(goToSection, (sectionId) => getSectionIndex(sectionId) !== -1, {
			started: (path) => analytics.track('tour_started', { path: path.id }),
			finished: (path) => analytics.track('tour_finished', { path: path.id })
		})
	);

	// The tour ends when the visitor wanders off its route or switches to plain view.
	$effect(() => {
		if (!tour.isActive) return;
		if (viewMode.isPlainView || cursor.current.id !== tour.currentSectionId) {
			tour.stop();
		}
	});

	const explorer = provideExplorer(new PortfolioExplorer());

	// ---------- search palette and terminal ----------
	let isPaletteOpen = $state(false);
	let isTerminalOpen = $state(false);

	function downloadResume(source: 'palette' | 'terminal') {
		analytics.track('resume_downloaded', { source });
		downloadFile(profile.resumeUrl, profile.resumeFileName);
	}

	const paletteEntries = buildPaletteEntries({
		sections,
		profile,
		visitPaths,
		goToSection,
		revealCard: (cardId, sectionId) => {
			explorer.revealCard(cardId);
			goToSection(sectionId);
		},
		showSkill: (skill) => {
			explorer.selectedSkill = skill;
			goToSection('skills');
		},
		startTour: (path) => tour.start(path),
		togglePlainView: () => viewMode.toggle(),
		downloadResume: () => downloadResume('palette'),
		openTerminal: () => (isTerminalOpen = true)
	});

	const terminalCommands = buildTerminalCommands({
		profile,
		sections,
		flight: () => cursor.flightStatus,
		goToSection,
		downloadResume: () => downloadResume('terminal'),
		openUrl: openInNewTab
	});

	// ---------- analytics ----------
	onMount(() => {
		// Lets CSS hide things that are only right once the real (phone or desktop) layout is known.
		document.documentElement.dataset.hydrated = 'true';
		analytics.start();
	});

	// Report each section once per visit.
	const viewedSectionIds = new Set<SectionId>();
	$effect(() => {
		const sectionId = cursor.current.id;
		if (viewMode.isPlainView || viewedSectionIds.has(sectionId)) return;
		viewedSectionIds.add(sectionId);
		analytics.track('section_viewed', { section: sectionId });
	});

	$effect(() => {
		if (isPaletteOpen) analytics.track('palette_opened', {});
	});

	$effect(() => {
		if (isTerminalOpen) analytics.track('terminal_opened', {});
	});

	// ---------- blueprint data ----------
	/** Aircraft parts that have a visible section behind them. */
	const interactiveParts = sections.map((section) => getBlueprintBinding(section.id).part);

	/** Short caption per aircraft part, for the hover label. */
	const partCaptions = Object.fromEntries(
		sections.map((section) => [getBlueprintBinding(section.id).part, section.title])
	) as Partial<Record<AircraftPartId, string>>;

	const activeBinding = $derived(getBlueprintBinding(cursor.current.id));

	// ---------- layout choice ----------
	let layoutPreference = $state<LayoutPreference>('balanced');

	const stageLayout = $derived<StageLayout>(
		layoutPreference === 'balanced' ? (cursor.index === 0 ? 'takeoff' : 'cruise') : layoutPreference
	);

	function chooseLayout(layout: LayoutPreference) {
		layoutPreference = layout;
		analytics.track('layout_changed', { layout });
	}

	/** Hide the hint once the visitor has moved off the first section. */
	let hasExplored = $state(false);
	$effect(() => {
		if (cursor.index !== 0) hasExplored = true;
	});
</script>

<svelte:head>
	<title>{profile.name} | {profile.jobTitle}</title>
</svelte:head>

<svelte:window
	onscroll={() => scroller.syncFromScroll()}
	onresize={() => scroller.syncFromScroll()}
/>

<h1 class="visually-hidden">{profile.name}, {profile.jobTitle}</h1>
<p class="visually-hidden" aria-live="polite">
	{viewMode.isPlainView ? 'Showing plain view' : `Showing ${cursor.current.title}`}
</p>

{#if viewMode.isPlainView}
	<div class="plain-view">
		{#each sections as section (section.id)}
			<section class="plain-section" id="plain-{section.id}">
				<SectionContent {section} expandAll />
			</section>
		{/each}
	</div>
{:else}
	<div
		class="scroll-track"
		style:--scroll-extra="{lastSectionIndex * SCROLL_DISTANCE_PER_SECTION_VH}vh"
	>
		<div class="stage" data-layout={stageLayout}>
			<div
				class="blueprint-area"
				use:swipe={{ enabled: isPhoneLayout.current, onSwipe: goToAdjacentSection }}
			>
				<Blueprint
					activePart={activeBinding.part}
					camera={activeBinding.camera}
					onSelectPart={selectAircraftPart}
					{interactiveParts}
					{partCaptions}
					orientation={isPhoneLayout.current ? 'horizontal' : 'vertical'}
					showRadar={isExtraAnimationOn('radarRings')}
				/>

				{#if !hasExplored && stageLayout !== 'reading'}
					<p class="explore-hint" transition:fade={{ duration: 300 }}>
						This is an Airbus A350-900.
						{isPhoneLayout.current
							? 'Tap a waypoint above, or swipe, to explore each part.'
							: 'Follow the flight path above, scroll through the page, or click a glowing marker.'}
					</p>
				{/if}
			</div>

			<article class="detail-panel" aria-label="Section details">
				<div class="panel-toolbar">
					<button type="button" class="search-button" onclick={() => (isPaletteOpen = true)}>
						Search <kbd>Ctrl K</kbd>
					</button>

					<div
						class="layout-group"
						role="group"
						aria-label="Choose how much room the aircraft gets"
					>
						<span class="toolbar-label">Layout</span>
						{#each LAYOUT_CHOICES as choice (choice.value)}
							<button
								type="button"
								class="layout-button"
								class:active={layoutPreference === choice.value}
								aria-pressed={layoutPreference === choice.value}
								title={choice.hint}
								onclick={() => chooseLayout(choice.value)}
							>
								{choice.label}
							</button>
						{/each}
					</div>
				</div>

				<TourBar />

				{#key cursor.current.id}
					<div class="panel-scroll" in:fade={{ duration: 180 }} use:wheelForwarder.attach>
						<div class="panel-inner">
							<SectionContent section={cursor.current} />
						</div>
					</div>
				{/key}

				<footer class="panel-footer">
					<button
						type="button"
						class="step-button"
						onclick={() => goToAdjacentSection(-1)}
						disabled={cursor.index === 0}
					>
						&lsaquo; Prev
					</button>
					<span class="step-counter">
						Waypoint {cursor.index + 1} / {sections.length}
					</span>
					<button
						type="button"
						class="step-button"
						onclick={() => goToAdjacentSection(1)}
						disabled={cursor.index === lastSectionIndex}
					>
						Next &rsaquo;
					</button>
				</footer>
			</article>

			<div class="instrument-panel" aria-hidden="true">
				<InstrumentCluster
					altitudeFeet={cursor.flightStatus.altitudeFeet}
					headingDegrees={cursor.flightStatus.headingDegrees}
					phase={cursor.flightStatus.phase}
				/>
				<div class="title-block">
					DWG <strong>A350-900 / ARJUN-M</strong><br />
					WAYPOINT <strong>{cursor.index + 1}/{sections.length}</strong> &nbsp; REV
					<strong>A</strong>
				</div>
			</div>
		</div>
	</div>
{/if}

<CommandPalette entries={paletteEntries} bind:open={isPaletteOpen} />
<TerminalDialog commands={terminalCommands} bind:open={isTerminalOpen} />

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
		height: calc(100svh - var(--chrome-height) + var(--scroll-extra));
	}

	.stage {
		position: sticky;
		top: var(--chrome-height);
		display: grid;
		/* Real column sizes come from the inline style (see stageColumns). */
		grid-template-columns: 1fr minmax(340px, 540px);
		height: calc(100svh - var(--chrome-height));
		overflow: hidden;
		background:
			linear-gradient(var(--grid) 1px, transparent 1px) 0 0 / 24px 24px,
			linear-gradient(90deg, var(--grid) 1px, transparent 1px) 0 0 / 24px 24px,
			var(--bg);
		/* The aircraft glides between "takeoff" and "cruise" instead of jumping. */
		transition: grid-template-columns 450ms cubic-bezier(0.2, 0.7, 0.2, 1);
	}

	.stage[data-layout='aircraft'] {
		grid-template-columns: 60fr 40fr;
	}

	.stage[data-layout='takeoff'] {
		grid-template-columns: 52fr 48fr;
	}

	.stage[data-layout='cruise'] {
		grid-template-columns: 34fr 66fr;
	}

	.stage[data-layout='reading'] {
		grid-template-columns: 18fr 82fr;
	}

	.blueprint-area {
		position: relative;
		min-width: 0;
		min-height: 0;
		overflow: hidden;
	}

	.explore-hint {
		position: absolute;
		top: 12px;
		left: 50%;
		transform: translateX(-50%);
		max-width: calc(100% - 24px);
		margin: 0;
		padding: 6px 12px;
		background: var(--panel);
		border: 1px solid var(--cyan);
		color: var(--cyan);
		font: 12px/1.4 var(--mono);
		text-align: center;
		pointer-events: none;
	}

	.detail-panel {
		display: flex;
		flex-direction: column;
		min-width: 0;
		min-height: 0;
		margin: 12px 24px 16px 0;
		background: var(--panel);
		border: 1px solid var(--line);
	}

	.panel-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 4px;
		padding: 6px 10px;
		border-bottom: 1px solid var(--grid);
	}

	.toolbar-label {
		margin-right: 6px;
		font: 11px var(--mono);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--dim);
	}

	.layout-button {
		padding: 4px 10px;
		background: none;
		border: 1px solid var(--grid);
		color: var(--dim);
		font: 12px var(--mono);
		cursor: pointer;
	}

	.layout-button:hover {
		color: var(--line);
		border-color: var(--line);
	}

	.layout-button.active {
		color: var(--cyan);
		border-color: var(--cyan);
	}

	.layout-button:focus-visible {
		outline: 2px solid var(--cyan);
		outline-offset: 2px;
	}

	.panel-scroll {
		flex: 1;
		min-height: 0;
		padding: 22px clamp(16px, 3vw, 36px);
		overflow-y: auto;
		/* Scrolling inside the panel never scrolls the page behind it. */
		/* overscroll-behavior: contain; */
	}

	/* Keeps lines readable when the panel is very wide (Reading layout). */
	.panel-inner {
		max-width: 960px;
		margin-inline: auto;
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

	/* Instruments and drawing title block, bottom left of the blueprint. Never blocks clicks. */
	.instrument-panel {
		position: absolute;
		left: 12px;
		bottom: 12px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 8px;
		pointer-events: none;
	}

	.title-block {
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

	/* A slim aircraft rail has no room for instruments. */
	.stage[data-layout='reading'] .instrument-panel {
		display: none;
	}

	.layout-group {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.search-button {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 4px 10px;
		background: none;
		border: 1px solid var(--grid);
		color: var(--dim);
		font: 12px var(--mono);
		cursor: pointer;
	}

	.search-button:hover {
		color: var(--line);
		border-color: var(--cyan);
	}

	.search-button:focus-visible {
		outline: 2px solid var(--cyan);
		outline-offset: 2px;
	}

	.search-button kbd {
		padding: 0 5px;
		border: 1px solid var(--grid);
		font: 10px var(--mono);
	}

	@media (max-width: 820px) {
		.search-button kbd {
			display: none;
		}
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
		/* Keep the heading clear of the pinned header after scrolling. */
		scroll-margin-top: calc(var(--chrome-height) + 12px);
	}

	/* ---------- short screens: drop the instruments ---------- */
	@media (max-height: 560px) {
		.instrument-panel {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.stage {
			transition: none;
		}
	}

	/* ---------- phones ---------- */
	@media (max-width: 820px) {
		.scroll-track {
			height: auto;
		}

		.stage,
		.stage[data-layout] {
			grid-template-columns: 1fr;
			grid-template-rows: 28svh minmax(0, 1fr);
		}

		/* The aircraft is drawn sideways on phones, which is only known after hydration. */
		:global(html:not([data-hydrated])) .blueprint-area {
			visibility: hidden;
		}

		.detail-panel {
			margin: 0 10px 10px;
		}

		.layout-group {
			display: none;
		}

		.panel-scroll {
			padding: 16px;
		}

		.instrument-panel {
			display: none;
		}
	}
</style>
