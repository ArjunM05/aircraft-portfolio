import { sections } from '#lib/data/sections.js';
import { computeFlightStatus } from '#lib/flight/flight-status.js';

/** Which section is showing in the blueprint view. */
export class SectionCursor {
	index = $state(0);
	current = $derived(sections[this.index]);
	flightStatus = $derived(computeFlightStatus(this.index, sections.length));
}
