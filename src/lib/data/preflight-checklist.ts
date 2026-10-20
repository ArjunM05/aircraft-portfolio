/** Browser-tab storage key that remembers the intro has played. Keep in sync with src/app.html. */
export const PREFLIGHT_SEEN_STORAGE_KEY = 'portfolio-preflight-seen';

export interface ChecklistItem {
	label: string;
	status: string;
}

export const preflightHeading = 'PRE-FLIGHT CHECKLIST';

export const preflightChecklist: ChecklistItem[] = [
	{ label: 'Frontend interfaces', status: 'CHECKED' },
	{ label: 'Backend systems', status: 'CHECKED' },
	{ label: 'AI / ML engines', status: 'CHECKED' },
	{ label: 'Resume', status: 'ATTACHED' }
];

export const preflightClearance = 'CLEARED FOR TAKEOFF';
