import type { IncidentReportSection } from '../types';

export const incidentReportsSection: IncidentReportSection = {
	kind: 'incident-report',
	id: 'incident-report',
	menuLabel: 'Incident',
	title: 'Incident reports',
	aircraftPartName: 'Black box',
	partExplanation:
		'The flight data recorder, or black box, sits in the tail and records what happened so engineers can learn from it. This is how I write up a bug.',
	hasSampleContent: true,
	reports: [
		{
			incidentId: 'INC-2026-001',
			headline: 'Shipment list endpoint slowed under peak load',
			severity: 'Moderate',
			status: 'Resolved',
			summary:
				'Response times for the shipment list climbed from under a second to several seconds as record volume grew.',
			timeline: [
				{ time: '09:12', event: 'Latency alert fires' },
				{ time: '09:40', event: 'Slow query traced using correlation IDs' },
				{ time: '11:05', event: 'Fix deployed' },
				{ time: '11:30', event: 'Latency back to normal' }
			],
			probableCause:
				'A missing composite index plus an N+1 query pattern when loading tracking history.',
			contributingFactors:
				'No query-plan review in code review, and data volume had outgrown early assumptions.',
			correctiveActions: [
				'Added a composite index on shipment ID and status',
				'Replaced the N+1 pattern with a single joined query',
				'Added slow-query logging and a latency alert',
				'Added a regression test'
			],
			outcome: 'Data load efficiency improved by 25%.',
			isSample: true,
			startsOpen: true,
			extras: [
				{
					kind: 'telemetry',
					subtitle: 'Before and after the fix',
					bars: [
						{
							label: 'Shipment list response, during the incident',
							barPercent: 100,
							displayValue: '3.4 s'
						},
						{ label: 'After the fix', barPercent: 18, displayValue: '0.6 s' }
					]
				}
			]
		},
		{
			incidentId: 'INC-2026-002',
			headline: 'Image upload endpoint timed out on large batches',
			severity: 'Moderate',
			status: 'Resolved',
			summary:
				'Uploads of many large images stalled the inference endpoint and some requests timed out.',
			timeline: [
				{ time: '14:05', event: 'Timeout errors reported by testers' },
				{ time: '14:30', event: 'Large uploads identified as the trigger' },
				{ time: '16:10', event: 'Fix deployed' }
			],
			probableCause:
				'Full-size images went straight to the model, so each request held a worker for too long.',
			contributingFactors: 'No upload size limit and no request timeouts.',
			correctiveActions: [
				'Resize images before inference',
				'Added upload size limits and request timeouts',
				'Added a health-check endpoint'
			],
			outcome: 'Large uploads now complete reliably.',
			isSample: true
		},
		{
			incidentId: 'INC-2026-003',
			headline: 'Dashboard showed stale shipment status',
			severity: 'Low',
			status: 'Resolved',
			summary: 'Some operators saw old shipment statuses after an update.',
			timeline: [
				{ time: '10:15', event: 'Operator reports an out-of-date status' },
				{ time: '10:50', event: 'Cached API responses identified' },
				{ time: '12:00', event: 'Fix deployed' }
			],
			probableCause: 'A cached response was served after the shipment record had changed.',
			contributingFactors: 'Cache headers were never reviewed for frequently changing data.',
			correctiveActions: [
				'Set cache headers per endpoint',
				'Refetch status after every update',
				'Added a test for stale data'
			],
			outcome: 'Operators now see the current status after every update.',
			isSample: true
		}
	]
};
