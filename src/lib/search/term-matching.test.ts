import { describe, expect, it } from 'vitest';
import { termsOverlap, textMentions, tokenize } from './term-matching.js';

describe('tokenize', () => {
	it('lowercases and splits on spaces and punctuation', () => {
		expect(tokenize('REST APIs, GraphQL')).toEqual(['rest', 'apis', 'graphql']);
	});

	it('keeps C#, C++, Node.js and ASP.NET whole', () => {
		expect(tokenize('C# / ASP.NET')).toEqual(['c#', 'asp.net']);
		expect(tokenize('C++')).toEqual(['c++']);
		expect(tokenize('Node.js')).toEqual(['node.js']);
	});

	it('drops dots at the start or end of a word', () => {
		expect(tokenize('.NET')).toEqual(['net']);
		expect(tokenize('python.')).toEqual(['python']);
	});

	it('returns nothing for empty or symbol-only text', () => {
		expect(tokenize('')).toEqual([]);
		expect(tokenize(' / - ')).toEqual([]);
	});
});

describe('termsOverlap', () => {
	it('matches a short label against a longer one that contains all its words', () => {
		expect(termsOverlap('C#', 'C# / ASP.NET')).toBe(true);
		expect(termsOverlap('REST', 'REST APIs')).toBe(true);
	});

	it('works in both directions', () => {
		expect(termsOverlap('REST APIs', 'REST')).toBe(true);
	});

	it('ignores case', () => {
		expect(termsOverlap('postgresql', 'PostgreSQL')).toBe(true);
	});

	it('compares whole words, so Java is not JavaScript', () => {
		expect(termsOverlap('Java', 'JavaScript')).toBe(false);
		expect(termsOverlap('Node', 'Node.js')).toBe(false);
	});

	it('does not match unrelated labels', () => {
		expect(termsOverlap('Python', 'TypeScript')).toBe(false);
	});

	it('never matches an empty label', () => {
		expect(termsOverlap('', 'Python')).toBe(false);
		expect(termsOverlap('Python', ' / ')).toBe(false);
	});
});

describe('textMentions', () => {
	it('finds a word inside a longer text', () => {
		expect(textMentions('Built APIs with Python and Flask', 'Flask')).toBe(true);
	});

	it('needs every word of a multi-word term', () => {
		expect(textMentions('Uses REST APIs daily', 'REST APIs')).toBe(true);
		expect(textMentions('Uses REST only', 'REST APIs')).toBe(false);
	});

	it('compares whole words', () => {
		expect(textMentions('JavaScript developer', 'Java')).toBe(false);
	});

	it('is false for an empty term or empty text', () => {
		expect(textMentions('Anything at all', '')).toBe(false);
		expect(textMentions('', 'Python')).toBe(false);
	});
});
