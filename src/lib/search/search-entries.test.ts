import { describe, expect, it } from 'vitest';
import { searchEntries, type Searchable } from './search-entries.js';

function entry(label: string, keywords: string[] = [], detail?: string): Searchable {
	return { label, keywords, detail };
}

describe('searchEntries', () => {
	it('returns the first entries when the query is empty', () => {
		const entries = [entry('One'), entry('Two'), entry('Three')];

		expect(searchEntries(entries, '', 2)).toEqual([entries[0], entries[1]]);
		expect(searchEntries(entries, '   ', 5)).toEqual(entries);
	});

	it('ranks label starts above label matches above keyword matches', () => {
		const startsWith = entry('Resume download');
		const inLabel = entry('Download resume');
		const inKeywords = entry('Other', ['resume']);

		const results = searchEntries([inKeywords, inLabel, startsWith], 'resume', 10);

		expect(results).toEqual([startsWith, inLabel, inKeywords]);
	});

	it('needs every word of the query to match somewhere', () => {
		const message = entry('Send me a message', ['contact', 'hire']);
		const resume = entry('Download resume', ['cv'], 'PDF');

		expect(searchEntries([message, resume], 'send hire', 10)).toEqual([message]);
		expect(searchEntries([message, resume], 'send pdf', 10)).toEqual([]);
	});

	it('searches the detail text, ignoring case', () => {
		const skills = entry('Skills', [], 'Wings');

		expect(searchEntries([skills], 'WINGS', 10)).toEqual([skills]);
	});

	it('respects the limit', () => {
		const entries = [entry('Alpha one'), entry('Alpha two'), entry('Alpha three')];

		expect(searchEntries(entries, 'alpha', 2)).toHaveLength(2);
	});

	it('does not change the list it was given', () => {
		const entries = [entry('B'), entry('A', ['b'])];
		const copy = [...entries];

		searchEntries(entries, 'b', 10);

		expect(entries).toEqual(copy);
	});
});
