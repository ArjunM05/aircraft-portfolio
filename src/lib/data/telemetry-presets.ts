import type { TelemetryBar } from './types.js';

export const asdTelemetryBars: TelemetryBar[] = [
	{ label: 'Detection accuracy', barPercent: 98, displayValue: '98%' }
];

// +18% F1 means the baseline is about 85% as long as the fused result.
export const sentimentTelemetryBars: TelemetryBar[] = [
	{ label: 'F1-score, single-modality baseline', barPercent: 85, displayValue: 'baseline' },
	{ label: 'F1-score with multimodal fusion (+18%)', barPercent: 100, displayValue: '+18%' }
];

export const veggieVisionTelemetryBars: TelemetryBar[] = [
	{ label: 'Real-time detection accuracy', barPercent: 91, displayValue: '91%' }
];
