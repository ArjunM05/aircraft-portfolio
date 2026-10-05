<script lang="ts">
	import Accordion from './Accordion.svelte';
	import BoardingPass from './BoardingPass.svelte';
	import Gauge from './Gauge.svelte';
	import IncidentCard from './IncidentCard.svelte';
	import ProjectCard from './ProjectCard.svelte';
	import SectionLinkList from './SectionLinkList.svelte';
	import { useNavigation } from '#lib/navigation-context.js';
	import {
		disciplineLabels,
		disciplinesToLinks,
		profile,
		SHOW_SAMPLE_BADGES,
		type Discipline,
		type Section
	} from '#lib/data/sections.js';

	interface Props {
		section: Section;
		/** Plain view: open every accordion and let them stay open together. */
		expandAll?: boolean;
	}

	let { section, expandAll = false }: Props = $props();

	const goToSection = useNavigation();

	const disciplineOrder: Discipline[] = ['frontend', 'backend', 'ai-ml'];
	const web3formsAccessKey: string | undefined = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

	/** Accordions in the same group close each other, except in plain view. */
	const accordionGroup = (groupName: string) => (expandAll ? undefined : groupName);
	const opensByDefault = (startsOpen?: boolean) => expandAll || Boolean(startsOpen);
</script>

<!-- "Frontend > Backend > AI / ML" strip, with the current discipline highlighted. -->
{#snippet disciplinePipeline(currentDiscipline: Discipline)}
	<p class="small-heading">One flight, three disciplines</p>
	<div class="pipeline">
		{#each disciplineOrder as discipline, index (discipline)}
			<button
				type="button"
				class="pipeline-step"
				class:current={discipline === currentDiscipline}
				onclick={() => goToSection(discipline)}
			>
				{disciplineLabels[discipline]}
			</button>
			{#if index < disciplineOrder.length - 1}<span class="pipeline-arrow" aria-hidden="true"
					>&rsaquo;</span
				>{/if}
		{/each}
	</div>
{/snippet}

<header class="section-header">
	<p class="part-label">Aircraft part / {section.aircraftPartName}</p>
	<h2>{section.title}</h2>
	<p class="part-explanation">
		{section.partExplanation}
		{#if SHOW_SAMPLE_BADGES && section.hasSampleContent}
			<span class="sample-badge">sample data</span>
		{/if}
	</p>
</header>

{#if section.kind === 'intro'}
	<p class="job-title">{section.jobTitle}</p>
	<p>{section.tagline}</p>

	<div class="gauge-row">
		{#each section.gauges as gauge (gauge.label)}
			<Gauge percent={gauge.percent} displayValue={gauge.displayValue} label={gauge.label} />
		{/each}
	</div>

	<div class="button-row">
		<a class="action-button" href={profile.resumeUrl} download={profile.resumeFileName}
			>Download resume</a
		>
		<a class="action-button" href={profile.githubUrl} target="_blank" rel="noopener noreferrer"
			>GitHub</a
		>
		<button type="button" class="action-button" onclick={() => goToSection('contact')}
			>Send a message</button
		>
	</div>

	<SectionLinkList heading="Explore my work" links={section.exploreLinks} />

	{#each section.biography as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{:else if section.kind === 'work-history'}
	{#each section.entries as entry (entry.role + entry.organization)}
		<Accordion
			title={entry.role}
			subtitle="{entry.organization} | {entry.period}"
			groupName={accordionGroup(section.id)}
			startsOpen={opensByDefault(entry.startsOpen)}
		>
			<ul class="bullet-list">
				{#each entry.highlights as highlight (highlight)}
					<li>{highlight}</li>
				{/each}
			</ul>
			<SectionLinkList heading="Flown with" links={disciplinesToLinks(entry.disciplines)} />
		</Accordion>
	{/each}
{:else if section.kind === 'freelance'}
	{#each section.engagements as engagement (engagement.title)}
		<ProjectCard caseStudy={engagement} accordionGroup="freelance" {expandAll} />
	{/each}

	<h3>Working together</h3>
	<ul class="bullet-list">
		{#each section.workingTerms as term (term)}
			<li>{term}</li>
		{/each}
	</ul>
	<button type="button" class="action-button" onclick={() => goToSection('contact')}>
		{section.callToActionLabel}
	</button>
{:else if section.kind === 'frontend'}
	{@render disciplinePipeline('frontend')}
	<SectionLinkList heading="Used in" links={section.usedIn} />
	<ul class="tag-list">
		{#each section.technologies as technology (technology)}
			<li>{technology}</li>
		{/each}
	</ul>

	{#each section.projects as project (project.title)}
		<ProjectCard caseStudy={project} accordionGroup="frontend" {expandAll} />
	{/each}

	<h3>
		How I build interfaces
		{#if SHOW_SAMPLE_BADGES}<span class="sample-badge">sample data</span>{/if}
	</h3>
	<ul class="bullet-list">
		{#each section.principles as principle (principle)}
			<li>{principle}</li>
		{/each}
	</ul>
{:else if section.kind === 'backend'}
	{@render disciplinePipeline('backend')}
	<SectionLinkList heading="Used in" links={section.usedIn} />

	{#each section.projects as project (project.title)}
		<ProjectCard caseStudy={project} accordionGroup="backend" {expandAll} />
	{/each}
{:else if section.kind === 'ai-ml'}
	{@render disciplinePipeline('ai-ml')}
	<SectionLinkList heading="Used in" links={section.usedIn} />

	<div class="gauge-row">
		{#each section.gauges as gauge (gauge.label)}
			<Gauge percent={gauge.percent} displayValue={gauge.displayValue} label={gauge.label} />
		{/each}
	</div>

	<ul class="tag-list">
		{#each section.technologies as technology (technology)}
			<li>{technology}</li>
		{/each}
	</ul>

	{#each section.projects as project (project.title)}
		<ProjectCard caseStudy={project} accordionGroup="ai-ml" {expandAll} />
	{/each}
{:else if section.kind === 'skills'}
	{#each section.groups as group (group.name)}
		<h3>{group.name}</h3>
		<ul class="tag-list">
			{#each group.skills as skill (skill)}
				<li>{skill}</li>
			{/each}
		</ul>
	{/each}
{:else if section.kind === 'projects'}
	{#each section.projects as project (project.title)}
		<ProjectCard caseStudy={project} accordionGroup="projects" {expandAll} />
	{/each}
	<p class="meta-text">
		More code:
		<a href={section.githubUrl} target="_blank" rel="noopener noreferrer">github.com/ArjunM05</a>
	</p>
{:else if section.kind === 'incident-report'}
	{#each section.reports as report (report.incidentId)}
		<IncidentCard {report} accordionGroup="incidents" {expandAll} />
	{/each}
{:else if section.kind === 'certifications'}
	<ul class="bullet-list">
		{#each section.certifications as certification (certification)}
			<li>{certification}</li>
		{/each}
	</ul>
{:else if section.kind === 'education'}
	<h3>{section.degree}</h3>
	<p>{section.institution}</p>
	<p class="meta-text">{section.period}</p>
{:else if section.kind === 'contact'}
	<BoardingPass
		details={section.boardingPass}
		recipientEmail={profile.email}
		accessKey={web3formsAccessKey}
		fallbackLinks={section.profileLinks}
	/>

	<p>
		<a href="mailto:{profile.email}">{profile.email}</a> | {profile.location}
	</p>
	<p>
		{#each section.profileLinks as link (link.url)}
			<a class="profile-link" href={link.url} target="_blank" rel="noopener noreferrer"
				>{link.label}</a
			>
		{/each}
	</p>
	<a class="action-button" href={profile.resumeUrl} download={profile.resumeFileName}
		>Download resume</a
	>
	<aside class="landing-card" aria-label="End of flight">
		<p class="part-label">Landing</p>
		<p class="landing-title">
			Flight complete. Thank you for flying with {section.boardingPass.airlineName}.
		</p>
		<button type="button" class="action-button" onclick={() => goToSection('intro')}
			>Fly again</button
		>
	</aside>
{/if}

<style>
	h2 {
		margin: 0 0 4px;
		font: 600 clamp(30px, 4.2vw, 46px) / 1.05 var(--sans);
	}

	h3 {
		margin: 22px 0 2px;
		font: 600 20px/1.2 var(--sans);
	}

	p {
		max-width: 62ch;
		margin: 6px 0;
	}

	a {
		color: var(--line);
	}

	/* Links styled as buttons keep their button colours. */
	a.action-button {
		color: var(--amber);
	}
	a.action-button:hover,
	a.action-button:focus-visible {
		color: var(--bg);
	}

	.profile-link {
		margin-right: 14px;
	}

	.job-title {
		margin: 0;
		font: 600 20px var(--sans);
		color: var(--cyan);
	}

	.small-heading {
		margin: 8px 0 2px;
		font: 10px var(--mono);
		color: var(--dim);
		text-transform: uppercase;
	}

	.bullet-list {
		margin: 6px 0;
		padding-left: 18px;
	}

	.bullet-list li {
		max-width: 62ch;
		margin: 3px 0;
	}

	.gauge-row {
		display: flex;
		gap: 8px;
		margin: 14px 0;
	}

	.button-row {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.button-row .action-button {
		margin-top: 8px;
	}

	/* ---------- discipline pipeline ---------- */
	.pipeline {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px;
		margin: 6px 0 10px;
	}

	.pipeline-step {
		padding: 4px 10px;
		background: none;
		border: 1px solid var(--cyan);
		color: var(--line);
		font: 12px var(--mono);
		cursor: pointer;
	}

	.pipeline-step:hover,
	.pipeline-step:focus-visible,
	.pipeline-step.current {
		background: var(--cyan);
		color: var(--bg);
		outline: none;
	}

	.pipeline-arrow {
		color: var(--amber);
	}

	.landing-card {
		margin-top: 24px;
		padding: 14px;
		border: 1px dashed var(--amber);
	}

	.landing-title {
		margin: 4px 0 0;
		font: 600 18px/1.3 var(--sans);
	}
</style>
