export interface Searchable {
	label: string;
	detail?: string;
	keywords: string[];
}

/**
 * Every word of the query must appear somewhere in the entry.
 * Words that start the label score highest, then words inside the label, then anywhere else.
 */
export function searchEntries<T extends Searchable>(
	entries: readonly T[],
	query: string,
	limit: number
): T[] {
	const queryWords = query.toLowerCase().split(/\s+/).filter(Boolean);
	if (queryWords.length === 0) return entries.slice(0, limit);

	const scoredEntries: { entry: T; score: number }[] = [];

	for (const entry of entries) {
		const label = entry.label.toLowerCase();
		const everything = [label, entry.detail ?? '', ...entry.keywords].join(' ').toLowerCase();

		let score = 0;
		let matchesEveryWord = true;
		for (const word of queryWords) {
			if (label.startsWith(word)) score += 4;
			else if (label.includes(word)) score += 3;
			else if (everything.includes(word)) score += 1;
			else {
				matchesEveryWord = false;
				break;
			}
		}

		if (matchesEveryWord) scoredEntries.push({ entry, score });
	}

	return scoredEntries
		.sort((a, b) => b.score - a.score)
		.slice(0, limit)
		.map(({ entry }) => entry);
}
