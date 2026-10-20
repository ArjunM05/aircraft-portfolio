import type { CardExtra } from '#lib/data/types.js';

/** What every extra view receives. Each view narrows `E` to its own kind of extra. */
export interface ExtraViewProps<E extends CardExtra = CardExtra> {
	extra: E;
	/** Plain view: open the extra's accordion. */
	expandAll?: boolean;
}
