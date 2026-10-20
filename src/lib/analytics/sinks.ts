export type EventData = Record<string, string | number>;

/** Where events go. Add another provider by adding another class. */
export interface AnalyticsSink {
	start(): void;
	track(name: string, data: EventData): void;
}

declare global {
	interface Window {
		umami?: { track: (name: string, data?: EventData) => void };
	}
}

export class NoopSink implements AnalyticsSink {
	start(): void {}
	track(): void {}
}

/** Development helper: shows events in the browser console. */
export class ConsoleSink implements AnalyticsSink {
	start(): void {
		console.info('[analytics] console sink active (development only)');
	}

	track(name: string, data: EventData): void {
		console.info('[analytics]', name, data);
	}
}

const MAX_QUEUED_EVENTS = 50;

export class UmamiSink implements AnalyticsSink {
	readonly #websiteId: string;
	readonly #scriptUrl: string;
	#queue: [string, EventData][] = [];

	constructor(websiteId: string, scriptUrl: string) {
		this.#websiteId = websiteId;
		this.#scriptUrl = scriptUrl;
	}

	start(): void {
		const script = document.createElement('script');
		script.defer = true;
		script.src = this.#scriptUrl;
		script.dataset.websiteId = this.#websiteId;
		script.addEventListener('load', () => {
			for (const [name, data] of this.#queue) window.umami?.track(name, data);
			this.#queue = [];
		});
		document.head.append(script);
	}

	track(name: string, data: EventData): void {
		if (window.umami) {
			window.umami.track(name, data);
		} else if (this.#queue.length < MAX_QUEUED_EVENTS) {
			// The script has not loaded yet (or is blocked), so keep a few events for later.
			this.#queue.push([name, data]);
		}
	}
}
