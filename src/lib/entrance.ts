const playedEntrances = new Set<string>();

/**
 * True the first time it is asked about a name during a page visit, false afterwards.
 * Server rendering always says true, so the first browser render matches the server's HTML.
 */
export function shouldPlayEntrance(name: string): boolean {
	if (typeof window === 'undefined') return true;
	if (playedEntrances.has(name)) return false;

	playedEntrances.add(name);
	return true;
}
