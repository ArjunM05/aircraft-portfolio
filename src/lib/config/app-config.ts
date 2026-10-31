const DEFAULT_UMAMI_SCRIPT_URL = 'https://cloud.umami.is/script.js';

type Environment = Readonly<Record<string, unknown>>;

export interface AppConfig {
	contact: {
		web3formsAccessKey?: string;
	};
	analytics: {
		provider?: string;
		umamiWebsiteId?: string;
		umamiScriptUrl: string;
		isDevelopment: boolean;
	};
}

/** A variable's value, or undefined when it is missing or blank. */
function readText(environment: Environment, name: string): string | undefined {
	const value = environment[name];
	return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

/** Turns raw environment variables into typed settings. Pure, so it can be tested with a plain object. */
export function readAppConfig(environment: Environment): AppConfig {
	return {
		contact: {
			web3formsAccessKey: readText(environment, 'VITE_WEB3FORMS_ACCESS_KEY')
		},
		analytics: {
			provider: readText(environment, 'VITE_ANALYTICS_PROVIDER'),
			umamiWebsiteId: readText(environment, 'VITE_UMAMI_WEBSITE_ID'),
			umamiScriptUrl: readText(environment, 'VITE_UMAMI_SCRIPT_URL') ?? DEFAULT_UMAMI_SCRIPT_URL,
			isDevelopment: environment.DEV === true
		}
	};
}

/** The only place `import.meta.env` is read. */
export const appConfig: AppConfig = readAppConfig(import.meta.env);
