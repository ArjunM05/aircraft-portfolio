import { describe, expect, it } from 'vitest';
import { readAppConfig } from './app-config.js';

describe('readAppConfig', () => {
	it('uses safe defaults when nothing is set', () => {
		expect(readAppConfig({})).toEqual({
			contact: { web3formsAccessKey: undefined },
			analytics: {
				provider: undefined,
				umamiWebsiteId: undefined,
				umamiScriptUrl: 'https://cloud.umami.is/script.js',
				isDevelopment: false
			}
		});
	});

	it('reads the contact and analytics settings', () => {
		const config = readAppConfig({
			VITE_WEB3FORMS_ACCESS_KEY: 'abc',
			VITE_ANALYTICS_PROVIDER: 'umami',
			VITE_UMAMI_WEBSITE_ID: 'site-1',
			VITE_UMAMI_SCRIPT_URL: 'https://stats.example.com/script.js'
		});

		expect(config.contact.web3formsAccessKey).toBe('abc');
		expect(config.analytics.provider).toBe('umami');
		expect(config.analytics.umamiWebsiteId).toBe('site-1');
		expect(config.analytics.umamiScriptUrl).toBe('https://stats.example.com/script.js');
	});

	it('trims values and treats blank ones as missing', () => {
		const config = readAppConfig({
			VITE_WEB3FORMS_ACCESS_KEY: '  abc  ',
			VITE_UMAMI_WEBSITE_ID: '   ',
			VITE_UMAMI_SCRIPT_URL: ''
		});

		expect(config.contact.web3formsAccessKey).toBe('abc');
		expect(config.analytics.umamiWebsiteId).toBeUndefined();
		expect(config.analytics.umamiScriptUrl).toBe('https://cloud.umami.is/script.js');
	});

	it('ignores values that are not text', () => {
		expect(readAppConfig({ VITE_UMAMI_WEBSITE_ID: 123 }).analytics.umamiWebsiteId).toBeUndefined();
	});

	it('recognises development mode only when the flag is the boolean true', () => {
		expect(readAppConfig({ DEV: true }).analytics.isDevelopment).toBe(true);
		expect(readAppConfig({ DEV: 'true' }).analytics.isDevelopment).toBe(false);
		expect(readAppConfig({ DEV: false }).analytics.isDevelopment).toBe(false);
	});
});
