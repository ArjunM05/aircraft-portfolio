import { VIEWBOX_HEIGHT, VIEWBOX_WIDTH, type BlueprintOrientation } from './geometry.js';
import type { CameraTarget } from './types.js';

/** Camera easing: share of the remaining distance covered each frame. */
export const CAMERA_SMOOTHING_PER_FRAME = 0.14;
const CAMERA_SETTLE_THRESHOLD = 0.05;
/** Zoom differences are small numbers, so they are weighted up when checking "are we there yet". */
const ZOOM_DISTANCE_WEIGHT = 50;

/** One easing step: move a share of the remaining distance towards the target. */
export function stepTowards(
	current: CameraTarget,
	target: CameraTarget,
	smoothing: number
): CameraTarget {
	return {
		centerX: current.centerX + (target.centerX - current.centerX) * smoothing,
		centerY: current.centerY + (target.centerY - current.centerY) * smoothing,
		zoom: current.zoom + (target.zoom - current.zoom) * smoothing
	};
}

/** Close enough to stop animating? */
export function hasArrived(current: CameraTarget, target: CameraTarget): boolean {
	const remainingDistance =
		Math.abs(target.centerX - current.centerX) +
		Math.abs(target.centerY - current.centerY) +
		Math.abs(target.zoom - current.zoom) * ZOOM_DISTANCE_WEIGHT;

	return remainingDistance < CAMERA_SETTLE_THRESHOLD;
}

/** The size of the SVG view for each orientation (the aircraft is turned sideways on phones). */
export function viewFrameFor(orientation: BlueprintOrientation) {
	const isHorizontal = orientation === 'horizontal';

	return {
		isHorizontal,
		width: isHorizontal ? VIEWBOX_HEIGHT : VIEWBOX_WIDTH,
		height: isHorizontal ? VIEWBOX_WIDTH : VIEWBOX_HEIGHT
	};
}

export type ViewFrame = ReturnType<typeof viewFrameFor>;

/** Move the view to the camera's centre, turn the aircraft if needed, then zoom. */
export function buildCameraTransform(camera: CameraTarget, frame: ViewFrame): string {
	return (
		`translate(${frame.width / 2} ${frame.height / 2}) ` +
		(frame.isHorizontal ? 'rotate(-90) ' : '') +
		`scale(${camera.zoom}) ` +
		`translate(${-camera.centerX} ${-camera.centerY})`
	);
}
