import { CAMERA_SMOOTHING_PER_FRAME, hasArrived, stepTowards } from './camera-math.js';
import type { CameraTarget } from './types.js';

/** A camera that glides towards wherever it is told to look. `current` is reactive. */
export class SmoothCamera {
	current = $state<CameraTarget>({ centerX: 0, centerY: 0, zoom: 1 });

	#animationFrameId = 0;

	constructor(initial: CameraTarget) {
		// Start exactly where it is told to be, so the first paint is already correct.
		this.current = { ...initial };
	}

	/**
	 * Glide towards the target (or jump, for visitors who prefer reduced motion).
	 * Returns a function that stops the animation, so an effect can hand it straight back as cleanup.
	 */
	moveTo(target: CameraTarget, options: { snap?: boolean } = {}): () => void {
		this.#stop();

		if (options.snap) {
			this.current = { ...target };
			return () => {};
		}

		const moveOneStep = () => {
			const next = stepTowards(this.current, target, CAMERA_SMOOTHING_PER_FRAME);

			if (hasArrived(next, target)) {
				this.current = { ...target };
				return;
			}

			this.current = next;
			this.#animationFrameId = requestAnimationFrame(moveOneStep);
		};

		this.#animationFrameId = requestAnimationFrame(moveOneStep);
		return () => this.#stop();
	}

	#stop(): void {
		cancelAnimationFrame(this.#animationFrameId);
	}
}
