import type { SectionId } from './types.js';

/** Set to false to hide every "sample data" badge once the real content is in place. */
export const SHOW_SAMPLE_BADGES = true;

/**
 * Sections listed here are left out of the site: menu, scrolling, plain view and links.
 * Their data is still type-checked. Remove an id from this list to publish it again.
 */
export const hiddenSectionIds: SectionId[] = [
	'freelance',
	'incident-report',
	'ai-ml',
	'backend',
	'frontend'
];

/* ---------- extra animations ---------- */

interface AnimationSettings {
	/** Master switch. When false, every extra animation below is off, whatever its own setting. */
	enabled: boolean;
	/** The pre-flight checklist screen shown when the site first loads. */
	preflightIntro: boolean;
	/** The aircraft drawing itself, the scan line and the markers fading in. */
	draftingEffect: boolean;
	/** Radar rings and sweep behind the aircraft. */
	radarRings: boolean;
	/** The Intro section: typed job title, staggered rise-in, delayed gauge fill. */
	introEntrance: boolean;
}

const animationSettings: AnimationSettings = {
	enabled: true,
	preflightIntro: true,
	draftingEffect: true,
	radarRings: true,
	introEntrance: true
};

export type ExtraAnimation = Exclude<keyof AnimationSettings, 'enabled'>;

export function isExtraAnimationOn(animation: ExtraAnimation): boolean {
	return animationSettings.enabled && animationSettings[animation];
}
