/** Every event the site reports. Only section names, card ids and similar labels, never personal data. */
export interface AnalyticsEventMap {
	section_viewed: { section: string };
	card_opened: { card: string };
	skill_selected: { skill: string };
	resume_downloaded: { source: 'intro' | 'palette' | 'terminal' | 'contact' };
	tour_started: { path: string };
	tour_finished: { path: string };
	palette_opened: Record<string, never>;
	terminal_opened: Record<string, never>;
	layout_changed: { layout: string };
	message_sent: { method: 'web3forms' | 'fallback' };
}
