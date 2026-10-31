import { appConfig, type AppConfig } from '#lib/config/app-config.js';
import type { AnalyticsEventMap } from './events.js';
import { ConsoleSink, NoopSink, UmamiSink, type AnalyticsSink, type EventData } from './sinks.js';

function browserSignalsDoNotTrack(): boolean {
	return navigator.doNotTrack === '1' || (window as { doNotTrack?: string }).doNotTrack === '1';
}

function chooseSink(config: AppConfig['analytics']): AnalyticsSink {
	// Prerendering runs on the server, where there is nothing to track.
	if (typeof window === 'undefined') return new NoopSink();
	if (browserSignalsDoNotTrack()) return new NoopSink();

	if (config.provider === 'umami' && config.umamiWebsiteId) {
		return new UmamiSink(config.umamiWebsiteId, config.umamiScriptUrl);
	}

	return config.isDevelopment ? new ConsoleSink() : new NoopSink();
}

class Analytics {
	readonly #sink: AnalyticsSink;
	#hasStarted = false;

	constructor(sink: AnalyticsSink) {
		this.#sink = sink;
	}

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

export const analytics = new Analytics(chooseSink(appConfig.analytics));
