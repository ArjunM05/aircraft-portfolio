<script lang="ts">
	import { onMount } from 'svelte';

	let {
		target,
		durationMs = 1200,
		animate = true
	}: { target: number; durationMs?: number; animate?: boolean } = $props();

	let shownValue = $state(animate ? 0 : target);
	let element = $state<HTMLElement>();

	onMount(() => {
		if (!animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			shownValue = target;
			return;
		}
		// ...the rest of onMount stays exactly as it was

		const revealDelayMs = element
			? (parseFloat(getComputedStyle(element).getPropertyValue('--reveal-start')) || 0) * 1000
			: 0;

		let frameId = 0;
		const startTimer = window.setTimeout(() => {
			const startedAt = performance.now();

			const step = (now: number) => {
				const progress = Math.min(1, (now - startedAt) / durationMs);
				const eased = 1 - Math.pow(1 - progress, 3); // ease-out
				shownValue = Math.round(target * eased);
				if (progress < 1) frameId = requestAnimationFrame(step);
			};
			frameId = requestAnimationFrame(step);
		}, revealDelayMs);

		return () => {
			window.clearTimeout(startTimer);
			cancelAnimationFrame(frameId);
		};
	});
</script>

<span bind:this={element}>{shownValue}</span>
