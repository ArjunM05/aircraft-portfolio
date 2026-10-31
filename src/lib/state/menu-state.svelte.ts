/** The burger menu (plain view, small screens). */
export class MenuState {
	isOpen = $state(false);

	toggle(): void {
		this.isOpen = !this.isOpen;
	}

	close(): void {
		this.isOpen = false;
	}
}
