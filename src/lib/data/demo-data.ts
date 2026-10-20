import type { MockShipment } from './types.js';

export const flightBoardRows = [
	{ shipmentId: 'LT-1042', route: 'MAA-DXB', initialStatus: 'BOARDING' },
	{ shipmentId: 'LT-2088', route: 'BLR-SIN', initialStatus: 'IN TRANSIT' },
	{ shipmentId: 'LT-3150', route: 'DEL-FRA', initialStatus: 'IN TRANSIT' },
	{ shipmentId: 'LT-4471', route: 'BOM-LHR', initialStatus: 'ARRIVING' }
];

export const flightBoardStatuses = [
	'BOARDING',
	'IN TRANSIT',
	'ARRIVING',
	'DELIVERED',
	'CUSTOMS HOLD'
];

/** Fake database for the "Try the API" demo in the Backend section. */
export const mockShipments: Record<string, MockShipment> = {
	'LT-1042': {
		status: 'IN_TRANSIT',
		origin: 'MAA',
		destination: 'DXB',
		weightKg: 1280,
		flight: 'LT201',
		progressPercent: 64,
		eta: '2026-10-05T14:30:00Z'
	},
	'LT-2088': {
		status: 'DELIVERED',
		origin: 'BLR',
		destination: 'SIN',
		weightKg: 420,
		flight: 'LT318',
		progressPercent: 100,
		eta: '2026-10-02T09:10:00Z'
	},
	'LT-3150': {
		status: 'CUSTOMS_HOLD',
		origin: 'DEL',
		destination: 'FRA',
		weightKg: 2150,
		flight: 'LT772',
		progressPercent: 88,
		eta: '2026-10-06T06:45:00Z'
	}
};
