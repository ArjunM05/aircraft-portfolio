/**
 * Runs a request and aborts it if it takes too long.
 * The timer covers the whole job, including reading the reply body.
 */
export async function withTimeout<T>(
	timeoutMs: number,
	run: (signal: AbortSignal) => Promise<T>
): Promise<T> {
	const abortController = new AbortController();
	const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);

	try {
		return await run(abortController.signal);
	} finally {
		clearTimeout(timeoutId);
	}
}
