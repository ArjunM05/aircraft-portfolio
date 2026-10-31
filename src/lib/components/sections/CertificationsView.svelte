<script lang="ts">
	import type { CertificationsSection } from '#lib/data/types.js';
	import type { SectionViewProps } from './section-view-props.js';

	let { section }: SectionViewProps<CertificationsSection> = $props();
</script>

<ul class="bullet-list cert-list">
	{#each section.certifications as certification (certification.name)}
		<li>
			<span class="cert-name">{certification.name}</span>
			{#if certification.issuer}
				<span class="meta-text">| {certification.issuer}</span>
			{/if}

			{#if certification.url}
				<a
					class="cert-link"
					href={certification.url}
					target="_blank"
					rel="noopener noreferrer"
					aria-label="View certificate: {certification.name} (opens in a new tab)"
				>
					View <span aria-hidden="true">&#8599;</span>
				</a>
			{/if}
		</li>
	{/each}
</ul>

<style>
	li {
		break-inside: avoid;
	}

	.cert-link {
		display: block;
		margin-top: 2px;
		font: 12px var(--mono);
		white-space: nowrap;
	}
</style>
