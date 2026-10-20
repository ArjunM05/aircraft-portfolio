<script lang="ts">
	import BoardingPass from '#lib/components/BoardingPass.svelte';
	import { profile } from '#lib/data/profile.js';
	import type { ContactSection } from '#lib/data/types.js';
	import { useNavigation } from '#lib/navigation-context.js';
	import type { SectionViewProps } from './section-view-props.js';

	let { section }: SectionViewProps<ContactSection> = $props();

	const goToSection = useNavigation();

	// Still read here for now. A later refactor step injects it from one place instead.
	const web3formsAccessKey: string | undefined = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
</script>

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
	<button type="button" class="action-button" onclick={() => goToSection('intro')}>Fly again</button
	>
</aside>

<style>
	.profile-link {
		margin-right: 14px;
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
