<script lang="ts">
	interface Props {
		tags: string[];
	}

	let { tags }: Props = $props();
</script>

<ul class="tag-list">
	{#each tags as tag (tag)}
		<li>{tag}</li>
	{/each}
</ul>
