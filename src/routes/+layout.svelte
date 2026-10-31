<script lang="ts">
	import '../app.css';
	import FlightPath from '#lib/components/FlightPath.svelte';
	import PreflightIntro from '#lib/components/PreflightIntro.svelte';
	import {
		provideMenuState,
		provideSectionCursor,
		provideSectionNavigator,
		provideViewMode
	} from '#lib/app-contexts.js';
	import { profile, sections } from '#lib/data/sections.js';
	import { isExtraAnimationOn } from '#lib/data/site-config.js';
	import { provideNavigation } from '#lib/navigation-context.js';
	import { scrollToPlainSection } from '#lib/navigation/plain-scroll.js';
	import { SectionNavigator } from '#lib/navigation/section-navigator.js';
	import { MenuState } from '#lib/state/menu-state.svelte.js';
	import { SectionCursor } from '#lib/state/section-cursor.svelte.js';
	import { ViewMode } from '#lib/state/view-mode.svelte.js';

	const preflightIntroOn = isExtraAnimationOn('preflightIntro');
	const draftingEffectOn = isExtraAnimationOn('draftingEffect');
	const introEntranceOn = isExtraAnimationOn('introEntrance');

	let { children } = $props();

	// The layout is the one place that creates the shared state and wires it together.
	const menu = provideMenuState(new MenuState());

	const viewMode = provideViewMode(
		new ViewMode(() => {
			menu.close();
			window.scrollTo(0, 0);
		})
	);

	const cursor = provideSectionCursor(new SectionCursor());

	const sectionNavigator = provideSectionNavigator(
		new SectionNavigator({
			isPlainView: () => viewMode.isPlainView,
			scrollToPlainSection,
			onNavigate: () => menu.close()
		})
	);

	// Every "go to this section" chip in the page ends up here.
	provideNavigation((sectionId) => sectionNavigator.goTo(sectionId));

	const waypoints = sections.map((section) => ({
		id: section.id,
		label: section.menuLabel,
		title: section.title
	}));

	let headerElement: HTMLElement;
	let burgerButton: HTMLButtonElement | undefined = $state();

	function closeMenuOnEscape(event: KeyboardEvent) {
		if (event.key === 'Escape' && menu.isOpen) {
			menu.close();
			burgerButton?.focus();
		}
	}

	function closeMenuOnOutsideClick(event: MouseEvent) {
		if (menu.isOpen && !headerElement.contains(event.target as Node)) {
			menu.close();
		}
	}
</script>

<svelte:window onkeydown={closeMenuOnEscape} onclick={closeMenuOnOutsideClick} />

{#if preflightIntroOn}
	<PreflightIntro />
{/if}

<div
	class="app-shell"
	class:with-route-bar={!viewMode.isPlainView}
	class:no-preflight={!preflightIntroOn}
	class:no-drafting={!draftingEffectOn}
	class:no-entrance={!introEntranceOn}
>
	<a class="skip-link" href="#main-content">Skip to content</a>

	<div class="site-chrome">
		<header class="site-header" class:menu-open={menu.isOpen} bind:this={headerElement}>
			<button type="button" class="brand" onclick={() => sectionNavigator.goTo('intro')}>
				<span class="brand-name">{profile.name}</span>
				<span class="brand-tagline">/ A350-900 portfolio</span>
			</button>

			{#if viewMode.isPlainView}
				<nav id="section-menu" class="section-menu" aria-label="Flight plan">
					<ul class="menu-list">
						{#each sections as section (section.id)}
							<li>
								<button
									type="button"
									class="menu-item"
									onclick={() => sectionNavigator.goTo(section.id)}
								>
									{section.menuLabel}
								</button>
							</li>
						{/each}
					</ul>
				</nav>
			{/if}

			<button
				type="button"
				class="plain-view-toggle"
				aria-pressed={viewMode.isPlainView}
				onclick={() => viewMode.toggle()}
			>
				{viewMode.isPlainView ? 'Blueprint view' : 'Plain view'}
			</button>

			{#if viewMode.isPlainView}
				<button
					bind:this={burgerButton}
					type="button"
					class="burger"
					aria-expanded={menu.isOpen}
					aria-controls="section-menu"
					aria-label={menu.isOpen ? 'Close flight plan' : 'Open flight plan'}
					onclick={() => menu.toggle()}
				>
					<span class="burger-bar"></span>
					<span class="burger-bar"></span>
					<span class="burger-bar"></span>
				</button>
			{/if}
		</header>

		{#if !viewMode.isPlainView}
			<FlightPath
				{waypoints}
				activeIndex={cursor.index}
				onSelectWaypoint={(sectionId) => sectionNavigator.goTo(sectionId)}
				departureCode="MAA"
				arrivalCode="YOU"
			/>
		{/if}
	</div>

	<main id="main-content">
		{@render children()}
	</main>
</div>

<style>
	/* Pinned height at the top: just the header in plain view, header plus flight path in blueprint view. */
	.app-shell.with-route-bar {
		--chrome-height: calc(var(--header-height) + var(--route-bar-height));
	}

	/* ---------- skip link (visible only when focused with the keyboard) ---------- */
	.skip-link {
		position: absolute;
		top: -48px;
		left: 8px;
		z-index: 40;
		padding: 8px 14px;
		background: var(--amber);
		color: var(--bg);
		font: 600 14px var(--sans);
		text-decoration: none;
	}
	.skip-link:focus {
		top: 8px;
	}

	/* ---------- pinned top area ---------- */
	.site-chrome {
		position: sticky;
		top: 0;
		z-index: 30;
	}

	.site-header {
		position: relative;
		display: flex;
		align-items: center;
		gap: 8px;
		height: var(--header-height);
		padding: 0 16px;
		background: var(--panel);
		border-bottom: 1px solid var(--line);
	}

	.brand {
		margin-right: auto;
		padding: 0;
		background: none;
		border: 0;
		color: var(--line);
		text-align: left;
		cursor: pointer;
	}

	.brand-name {
		font: 600 20px var(--sans);
	}

	.brand-tagline {
		margin-left: 6px;
		font: 12px var(--mono);
		color: var(--cyan);
	}

	/* ---------- section menu (plain view, inline on wide screens) ---------- */
	.menu-list {
		display: flex;
		gap: 2px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.menu-item {
		padding: 6px 7px;
		background: none;
		border: 0;
		border-bottom: 2px solid transparent;
		color: var(--line);
		font: 12px var(--mono);
		cursor: pointer;
	}

	.menu-item:hover {
		color: var(--cyan);
		border-bottom-color: var(--cyan);
	}

	.menu-item:focus-visible,
	.brand:focus-visible,
	.plain-view-toggle:focus-visible,
	.burger:focus-visible {
		outline: 2px solid var(--cyan);
		outline-offset: 2px;
	}

	/* ---------- plain view toggle ---------- */
	.plain-view-toggle {
		padding: 6px 10px;
		background: none;
		border: 1px solid var(--cyan);
		color: var(--cyan);
		font: 12px var(--mono);
		white-space: nowrap;
		cursor: pointer;
	}

	.plain-view-toggle:hover,
	.plain-view-toggle[aria-pressed='true'] {
		background: var(--cyan);
		color: var(--bg);
	}

	/* ---------- burger icon (plain view, narrow screens only) ---------- */
	.burger {
		display: none;
		flex-direction: column;
		justify-content: center;
		gap: 5px;
		width: 44px;
		height: 44px;
		padding: 0 11px;
		background: none;
		border: 1px solid var(--line);
		cursor: pointer;
	}

	.burger-bar {
		display: block;
		height: 2px;
		background: var(--line);
		transition:
			transform 0.2s,
			opacity 0.2s;
	}

	.menu-open .burger-bar:nth-child(1) {
		transform: translateY(7px) rotate(45deg);
	}
	.menu-open .burger-bar:nth-child(2) {
		opacity: 0;
	}
	.menu-open .burger-bar:nth-child(3) {
		transform: translateY(-7px) rotate(-45deg);
	}

	/* ---------- responsive ---------- */
	@media (max-width: 1400px) {
		.brand-tagline {
			display: none;
		}
	}

	/* The plain-view menu collapses into a dropdown behind the burger icon. */
	@media (max-width: 1280px) {
		.burger {
			display: flex;
		}

		.section-menu {
			display: none;
			position: absolute;
			top: 100%;
			left: 0;
			right: 0;
			max-height: calc(100svh - var(--header-height));
			overflow-y: auto;
			background: var(--panel);
			border-bottom: 1px solid var(--line);
		}

		.menu-open .section-menu {
			display: block;
		}

		.menu-list {
			flex-direction: column;
			gap: 0;
		}

		.menu-item {
			width: 100%;
			padding: 14px 18px;
			border-bottom: 1px solid var(--grid);
			font-size: 14px;
			text-align: left;
		}
	}

	@media (max-width: 520px) {
		.plain-view-toggle {
			padding: 6px 8px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.burger-bar {
			transition: none;
		}
	}
</style>
