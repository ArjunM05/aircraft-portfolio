import { describe, expect, it } from 'vitest';
import {
	buildCopyableMessage,
	buildMailtoUrl,
	buildMessageBody,
	buildSubject
} from './message-builder.js';
import type { TicketFormValues } from './types.js';

const values: TicketFormValues = {
	passengerName: ' Ada ',
	passengerEmail: ' ada@example.com ',
	inquiryType: 'Job opportunity',
	message: ' Hello there '
};

describe('message builder', () => {
	it('builds a subject from the inquiry type and name', () => {
		expect(buildSubject(values)).toBe('[Portfolio] Job opportunity - Ada');
	});

	it('builds a body with a signature, trimming every field', () => {
		expect(buildMessageBody(values)).toBe('Hello there\n\n--\nAda\nada@example.com');
	});

	it('builds the copyable email', () => {
		expect(buildCopyableMessage('me@example.com', values)).toBe(
			'To: me@example.com\nSubject: [Portfolio] Job opportunity - Ada\n\nHello there\n\n--\nAda\nada@example.com'
		);
	});

	it('builds a mailto link that reads back to the same subject and body', () => {
		const url = new URL(buildMailtoUrl('me@example.com', values));

		expect(url.protocol).toBe('mailto:');
		expect(url.pathname).toBe('me@example.com');
		expect(url.searchParams.get('subject')).toBe(buildSubject(values));
		expect(url.searchParams.get('body')).toBe(buildMessageBody(values));
	});

	it('keeps characters that would break a link intact', () => {
		const tricky = { ...values, message: 'Tom & Jerry? 100% #1\nSecond line' };
		const url = new URL(buildMailtoUrl('me@example.com', tricky));

		expect(url.searchParams.get('body')).toBe(buildMessageBody(tricky));
	});
});
