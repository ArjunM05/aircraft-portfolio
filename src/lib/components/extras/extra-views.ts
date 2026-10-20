import type { Component } from 'svelte';
import type { CardExtra } from '#lib/data/types.js';
import ApiPlaygroundExtraView from './ApiPlaygroundExtraView.svelte';
import ArchitectureExtraView from './ArchitectureExtraView.svelte';
import type { ExtraViewProps } from './extra-view-props.js';
import FlightBoardExtraView from './FlightBoardExtraView.svelte';
import RequestPathExtraView from './RequestPathExtraView.svelte';
import TelemetryExtraView from './TelemetryExtraView.svelte';

/** One view per kind of extra, each receiving exactly its own kind of data. */
type ExtraViewRegistry = {
	[Kind in CardExtra['kind']]: Component<ExtraViewProps<Extract<CardExtra, { kind: Kind }>>>;
};

/**
 * To add a new kind of extra:
 *   1. add its interface to the CardExtra union in data/types.ts,
 *   2. create its view in this folder,
 *   3. add one line here.
 * TypeScript fails to compile until all three are done.
 */
export const extraViews: ExtraViewRegistry = {
	telemetry: TelemetryExtraView,
	architecture: ArchitectureExtraView,
	'request-path': RequestPathExtraView,
	'api-playground': ApiPlaygroundExtraView,
	'flight-board': FlightBoardExtraView
};
