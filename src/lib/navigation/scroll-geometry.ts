/** How far the visitor scrolls (in screen heights, as a percentage) to move to the next section. */
export const SCROLL_DISTANCE_PER_SECTION_VH = 45;

/** Lands just inside a section's scroll range, so rounding never tips into its neighbour. */
const SCROLL_LANDING_OFFSET_PX = 2;

export function scrollDistancePerSection(viewportHeightPx: number): number {
	return (viewportHeightPx * SCROLL_DISTANCE_PER_SECTION_VH) / 100;
}

export function scrollPositionForSection(
	sectionIndex: number,
	distancePerSectionPx: number
): number {
	return sectionIndex === 0 ? 0 : sectionIndex * distancePerSectionPx + SCROLL_LANDING_OFFSET_PX;
}

export function sectionIndexFromScroll(
	scrollY: number,
	distancePerSectionPx: number,
	lastSectionIndex: number
): number {
	const nearestSection = Math.round(scrollY / distancePerSectionPx);
	return Math.min(lastSectionIndex, Math.max(0, nearestSection));
}
