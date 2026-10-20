<script lang="ts">
	import CountUp from '#lib/components/CountUp.svelte';
	import Gauge from '#lib/components/Gauge.svelte';
	import SectionLinkList from '#lib/components/SectionLinkList.svelte';
	import TagList from '#lib/components/TagList.svelte';
	import VisitGuide from '#lib/components/VisitGuide.svelte';
	import { hero } from '#lib/data/hero.js';
	import { profile } from '#lib/data/profile.js';
	import { SHOW_SAMPLE_BADGES } from '#lib/data/site-config.js';
	import type { IntroSection } from '#lib/data/types.js';
	import { useNavigation } from '#lib/navigation-context.js';
	import type { SectionViewProps } from './section-view-props.js';
	import { analytics } from '#lib/analytics/analytics.js';
	import { shouldPlayEntrance } from '#lib/entrance.js';

	let { section, expandAll = false }: SectionViewProps<IntroSection> = $props();

	const goToSection = useNavigation();

	const playsEntrance = shouldPlayEntrance('intro');
</script>

<div class="intro-view" class:entrance-done={!playsEntrance}>
	<div class="kicker-row">
		<p class="job-title typed">{section.jobTitle}</p>
		{#if hero.availability}
			<span class="availability enter-up" style:--enter-order="1">
				<span class="availability-dot" aria-hidden="true"></span>
				{hero.availability}
			</span>
		{/if}
	</div>

	<p class="headline enter-up" style:--enter-order="1">{hero.headline}</p>
	<p class="enter-up" style:--enter-order="2">{section.tagline}</p>

	<div class="button-row enter-up" style:--enter-order="3">
		<button type="button" class="action-button primary" onclick={() => goToSection('projects')}>
			View projects
		</button>
		<a
			class="action-button"
			href={profile.resumeUrl}
			download={profile.resumeFileName}
			onclick={() => analytics.track('resume_downloaded', { source: 'intro' })}>Download resume</a
		>
		<a class="action-button" href={profile.githubUrl} target="_blank" rel="noopener noreferrer"
			>GitHub</a
		>
		<button type="button" class="action-button" onclick={() => goToSection('contact')}
			>Contact</button
		>
	</div>

	<div class="enter-up" style:--enter-order="4">
		<TagList tags={hero.techHighlights} />
	</div>

	<dl class="stat-row enter-up" style:--enter-order="5">
		{#each hero.stats as stat (stat.label)}
			<div class="stat">
				<dt class="stat-value">
					<CountUp target={stat.value} animate={playsEntrance} />{stat.suffix}
				</dt>
				<dd class="stat-label">{stat.label}</dd>
			</div>
		{/each}
	</dl>
	{#if hero.statsAreSample && SHOW_SAMPLE_BADGES}
		<p class="stat-note"><span class="sample-badge">sample data</span></p>
	{/if}

	{#if !expandAll}
		<div class="enter-up" style:--enter-order="6">
			<VisitGuide />
		</div>
	{/if}

	<div class="gauge-row enter-up" style:--enter-order="7">
		{#each section.gauges as gauge (gauge.label)}
			<Gauge percent={gauge.percent} displayValue={gauge.displayValue} label={gauge.label} />
		{/each}
	</div>

	<div class="enter-up" style:--enter-order="8">
		<SectionLinkList heading="Explore my work" links={section.exploreLinks} />
	</div>

	<h3>More about me</h3>
	{#each section.biography as paragraph, index (paragraph)}
		<p class="enter-up" style:--enter-order={9 + index}>{paragraph}</p>
	{/each}
</div>

<style>
	.kicker-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px 14px;
	}

	.job-title {
		margin: 0;
		font: 600 20px var(--sans);
		color: var(--cyan);
	}

	/* The job title types itself in, one step per character. */
	.typed {
		animation: type-in 1.1s steps(30) backwards;
		animation-delay: calc(var(--reveal-start) + 0.1s);
	}

	@keyframes type-in {
		from {
			clip-path: inset(0 100% 0 0);
		}
		to {
			clip-path: inset(0 0 0 0);
		}
	}

	.availability {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		padding: 3px 10px;
		border: 1px solid var(--grid);
		border-radius: 999px;
		font: 12px var(--mono);
	}

	.availability-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #37d67a;
		box-shadow: 0 0 0 0 rgb(55 214 122 / 0.6);
		animation: availability-pulse 2s infinite;
	}

	@keyframes availability-pulse {
		70% {
			box-shadow: 0 0 0 8px rgb(55 214 122 / 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgb(55 214 122 / 0);
		}
	}

	.headline {
		margin: 14px 0 8px;
		font: 700 clamp(26px, 3.2vw, 40px) / 1.15 var(--sans);
	}

	.primary {
		background: var(--cyan);
		border-color: var(--cyan);
		color: var(--bg);
	}

	.stat-row {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 10px;
		margin: 16px 0 6px;
	}

	.stat {
		padding: 10px 12px;
		border: 1px solid var(--grid);
	}

	.stat-value {
		font: 700 28px var(--mono);
		color: var(--cyan);
	}

	.stat-label {
		margin: 2px 0 0;
		font: 12px/1.35 var(--sans);
		color: var(--dim);
	}

	.stat-note {
		margin: 0 0 16px;
	}

	@media (prefers-reduced-motion: reduce) {
		.availability-dot {
			animation: none;
		}
	}

	/* Coming back to Intro later in the visit: show everything at once. */
	.entrance-done :global(.enter-up),
	.entrance-done .typed {
		animation: none;
	}
</style>
