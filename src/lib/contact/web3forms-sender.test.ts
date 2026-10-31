import { afterEach, describe, expect, it, vi } from 'vitest';
import type { TicketFormValues } from './types.js';
import { createWeb3FormsSender } from './web3forms-sender.js';

const values: TicketFormValues = {
	passengerName: ' Ada ',
	passengerEmail: ' ada@example.com ',
	inquiryType: 'Job opportunity',
	message: ' Hello there '
};

function replyWith(body: unknown, ok = true) {
	const fetchMock = vi.fn().mockResolvedValue({ ok, json: async () => body });
	vi.stubGlobal('fetch', fetchMock);
	return fetchMock;
}

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('createWeb3FormsSender', () => {
	it('identifies itself for analytics', () => {
		expect(createWeb3FormsSender('key').id).toBe('web3forms');
	});

	it('reports delivery when the service confirms it', async () => {
		replyWith({ success: true });

		expect(await createWeb3FormsSender('key').send(values)).toBe(true);
	});

	it('reports failure when the service says no', async () => {
		replyWith({ success: false, message: 'Invalid key' });

		expect(await createWeb3FormsSender('key').send(values)).toBe(false);
	});

	it('reports failure on an HTTP error even if the body claims success', async () => {
		replyWith({ success: true }, false);

		expect(await createWeb3FormsSender('key').send(values)).toBe(false);
	});

	it('reports failure when the network is down', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

		expect(await createWeb3FormsSender('key').send(values)).toBe(false);
	});

	it('reports failure when the reply is not readable', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
				json: async () => {
					throw new SyntaxError('Unexpected token');
				}
			})
		);

		expect(await createWeb3FormsSender('key').send(values)).toBe(false);
	});

	it('posts the trimmed message with the access key', async () => {
		const fetchMock = replyWith({ success: true });

		await createWeb3FormsSender('secret-key').send(values);

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.web3forms.com/submit');
		expect(init.method).toBe('POST');
		expect(JSON.parse(init.body as string)).toEqual({
			access_key: 'secret-key',
			subject: '[Portfolio] Job opportunity - Ada',
			from_name: 'Portfolio contact form',
			name: 'Ada',
			email: 'ada@example.com',
			inquiry_type: 'Job opportunity',
			message: 'Hello there'
		});
	});
});
