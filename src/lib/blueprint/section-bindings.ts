import type { SectionId } from '#lib/data/types.js';
import type { AircraftPartId, CameraTarget } from './types.js';

/** What the blueprint needs to know about a section: which part lights up and where the camera goes. */
export interface BlueprintBinding {
	part: AircraftPartId;
	camera: CameraTarget;
}

const blueprintBindings: Record<SectionId, BlueprintBinding> = {
	intro: { part: 'cockpit', camera: { centerX: 200, centerY: 306, zoom: 1 } },
	experience: { part: 'fuselage', camera: { centerX: 200, centerY: 230, zoom: 1.5 } },
	internships: { part: 'flaps', camera: { centerX: 270, centerY: 320, zoom: 3 } },
	freelance: { part: 'winglets', camera: { centerX: 394, centerY: 345, zoom: 4 } },
	frontend: { part: 'passenger-cabin', camera: { centerX: 200, centerY: 198, zoom: 2.6 } },
	backend: { part: 'avionics-bay', camera: { centerX: 200, centerY: 110, zoom: 3 } },
	'ai-ml': { part: 'engines', camera: { centerX: 290, centerY: 284, zoom: 3.4 } },
	skills: { part: 'wings', camera: { centerX: 300, centerY: 290, zoom: 1.9 } },
	projects: { part: 'cargo-hold', camera: { centerX: 200, centerY: 410, zoom: 2.6 } },
	'incident-report': { part: 'black-box', camera: { centerX: 200, centerY: 478, zoom: 3.4 } },
	certifications: { part: 'ailerons', camera: { centerX: 352, centerY: 350, zoom: 3.2 } },
	education: { part: 'elevators', camera: { centerX: 260, centerY: 535, zoom: 3 } },
	contact: { part: 'rudder', camera: { centerX: 200, centerY: 545, zoom: 3 } }
};

export function getBlueprintBinding(sectionId: SectionId): BlueprintBinding {
	return blueprintBindings[sectionId];
}

/** The first of the given sections that is shown by this aircraft part. */
export function findSectionIdForPart(
	part: AircraftPartId,
	sectionIds: SectionId[]
): SectionId | undefined {
	return sectionIds.find((sectionId) => blueprintBindings[sectionId].part === part);
}
