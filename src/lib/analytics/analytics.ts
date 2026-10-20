import type { AnalyticsEventMap } from './events.js';
import { ConsoleSink, NoopSink, UmamiSink, type AnalyticsSink, type EventData } from './sinks.js';

function browserSignalsDoNotTrack(): boolean {
	return navigator.doNotTrack === '1' || (window as { doNotTrack?: string }).doNotTrack === '1';
}

function chooseSink(): AnalyticsSink {
	// Prerendering runs on the server, where there is nothing to track.
	if (typeof window === 'undefined') return new NoopSink();
	if (browserSignalsDoNotTrack()) return new NoopSink();

	const provider = import.meta.env.VITE_ANALYTICS_PROVIDER;
	const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID;
	if (provider === 'umami' && websiteId) {
		const scriptUrl = import.meta.env.VITE_UMAMI_SCRIPT_URL ?? 'https://cloud.umami.is/script.js';
		return new UmamiSink(websiteId, scriptUrl);
	}

	return import.meta.env.DEV ? new ConsoleSink() : new NoopSink();
}

class Analytics {
	readonly #sink: AnalyticsSink = chooseSink();
	#hasStarted = false;

	/** Call once, in the browser, after the page has mounted. */
	start(): void {
		if (this.#hasStarted) return;
		this.#hasStarted = true;
		this.#sink.start();
	}

	track<Name extends keyof AnalyticsEventMap>(name: Name, data: AnalyticsEventMap[Name]): void {
		this.#sink.track(name, data as EventData);
	}
}

export const analytics = new Analytics();
