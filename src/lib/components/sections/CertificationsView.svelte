<script lang="ts">
	import type { CertificationsSection } from '#lib/data/types.js';
	import type { SectionViewProps } from './section-view-props.js';

	let { section }: SectionViewProps<CertificationsSection> = $props();
</script>

<ul class="bullet-list cert-list">
	{#each section.certifications as certification (certification)}
		<li>{certification}</li>
	{/each}
</ul>
