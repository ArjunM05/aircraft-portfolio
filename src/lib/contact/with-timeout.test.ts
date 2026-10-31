import { describe, expect, it } from 'vitest';
import { withTimeout } from './with-timeout.js';

describe('withTimeout', () => {
	it('returns what the request returns', async () => {
		await expect(withTimeout(1000, async () => 'done')).resolves.toBe('done');
	});

	it('gives the request a signal that is not aborted yet', async () => {
		const wasAborted = await withTimeout(1000, async (signal) => signal.aborted);

		expect(wasAborted).toBe(false);
	});

	it('aborts a request that takes too long', async () => {
		const slowRequest = withTimeout(
			20,
			(signal) =>
				new Promise<string>((_resolve, reject) => {
					signal.addEventListener('abort', () => reject(new Error('aborted')));
				})
		);

		await expect(slowRequest).rejects.toThrow('aborted');
	});
});
