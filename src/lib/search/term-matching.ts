/** Splits text into lowercase words, keeping things like "c#", "node.js" and "asp.net" whole. */
export function tokenize(text: string): string[] {
	return text
		.toLowerCase()
		.split(/[^a-z0-9#+.]+/)
		.map((token) => token.replace(/^\.+|\.+$/g, ''))
		.filter(Boolean);
}

/**
 * Do two labels talk about the same thing? "C#" matches "C# / ASP.NET", and "REST" matches
 * "REST APIs", but "Java" does not match "JavaScript" because whole words are compared.
 */
export function termsOverlap(first: string, second: string): boolean {
	const firstTokens = tokenize(first);
	const secondTokens = tokenize(second);
	if (firstTokens.length === 0 || secondTokens.length === 0) return false;

	const isSubset = (small: string[], large: string[]) =>
		small.every((token) => large.includes(token));
	return isSubset(firstTokens, secondTokens) || isSubset(secondTokens, firstTokens);
}

/** Does a longer text (a job description, say) mention the term? */
export function textMentions(text: string, term: string): boolean {
	const termTokens = tokenize(term);
	if (termTokens.length === 0) return false;

	const textTokens = new Set(tokenize(text));
	return termTokens.every((token) => textTokens.has(token));
}
