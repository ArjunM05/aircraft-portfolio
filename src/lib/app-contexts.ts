import { getContext, setContext } from 'svelte';
import type { SectionNavigator } from '#lib/navigation/section-navigator.js';
import type { MenuState } from '#lib/state/menu-state.svelte.js';
import type { SectionCursor } from '#lib/state/section-cursor.svelte.js';
import type { ViewMode } from '#lib/state/view-mode.svelte.js';

/** Makes a matching pair: one function to provide a value, one to read it further down the tree. */
function createRequiredContext<Value>(name: string): [(value: Value) => Value, () => Value] {
	const key = Symbol(name);

	function provide(value: Value): Value {
		setContext(key, value);
		return value;
	}

	function use(): Value {
		const value = getContext<Value | undefined>(key);
		if (value === undefined) {
			throw new Error(`${name} is missing. It is provided once, in +layout.svelte.`);
		}
		return value;
	}

	return [provide, use];
}

export const [provideSectionCursor, useSectionCursor] =
	createRequiredContext<SectionCursor>('SectionCursor');
export const [provideViewMode, useViewMode] = createRequiredContext<ViewMode>('ViewMode');
export const [provideMenuState, useMenuState] = createRequiredContext<MenuState>('MenuState');
export const [provideSectionNavigator, useSectionNavigator] =
	createRequiredContext<SectionNavigator>('SectionNavigator');
