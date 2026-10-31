import { appConfig, type AppConfig } from '#lib/config/app-config.js';
import type { MessageSender } from './types.js';
import { createWeb3FormsSender } from './web3forms-sender.js';

/** Picks a sender from the settings. Returns undefined when none is configured. */
export function createDefaultMessageSender(
	config: AppConfig['contact'] = appConfig.contact
): MessageSender | undefined {
	if (config.web3formsAccessKey) {
		return createWeb3FormsSender(config.web3formsAccessKey);
	}

	return undefined;
}
