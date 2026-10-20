import { getContext, setContext } from 'svelte';
import type { PortfolioExplorer } from './explorer.svelte.js';

const EXPLORER_KEY = Symbol('portfolio-explorer');

export function provideExplorer(explorer: PortfolioExplorer): PortfolioExplorer {
	return setContext(EXPLORER_KEY, explorer);
}

export function useExplorer(): PortfolioExplorer {
	const explorer = getContext<PortfolioExplorer | undefined>(EXPLORER_KEY);
	if (!explorer) throw new Error('useExplorer() was called outside the page that provides it.');
	return explorer;
}
