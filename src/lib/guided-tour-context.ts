import { getContext, setContext } from 'svelte';
import type { GuidedTour } from './guided-tour.svelte.js';

const GUIDED_TOUR_KEY = Symbol('guided-tour');

export function provideGuidedTour(tour: GuidedTour): GuidedTour {
	return setContext(GUIDED_TOUR_KEY, tour);
}

export function useGuidedTour(): GuidedTour {
	const tour = getContext<GuidedTour | undefined>(GUIDED_TOUR_KEY);
	if (!tour) throw new Error('useGuidedTour() was called outside the page that provides it.');
	return tour;
}
