/** Blueprint view or plain text view. */
export class ViewMode {
	isPlainView = $state(false);

	readonly #onToggled: (isPlainView: boolean) => void;

	/** `onToggled` is for side effects (closing the menu, scrolling to the top). The class stays pure. */
	constructor(onToggled: (isPlainView: boolean) => void = () => {}) {
		this.#onToggled = onToggled;
	}

	toggle(): void {
		this.isPlainView = !this.isPlainView;
		this.#onToggled(this.isPlainView);
	}
}
