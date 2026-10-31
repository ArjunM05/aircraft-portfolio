import { buildSubject } from './message-builder.js';
import type { MessageSender } from './types.js';
import { withTimeout } from './with-timeout.js';

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const REQUEST_TIMEOUT_MS = 10_000;

export function createWeb3FormsSender(accessKey: string): MessageSender {
	return {
		id: 'web3forms',

		async send(values) {
			try {
				return await withTimeout(REQUEST_TIMEOUT_MS, async (signal) => {
					const response = await fetch(WEB3FORMS_ENDPOINT, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
						body: JSON.stringify({
							access_key: accessKey,
							subject: buildSubject(values),
							from_name: 'Portfolio contact form',
							// Web3Forms uses "email" as the reply-to address.
							name: values.passengerName.trim(),
							email: values.passengerEmail.trim(),
							inquiry_type: values.inquiryType,
							message: values.message.trim()
						}),
						signal
					});

					const result = await response.json();
					return response.ok && result.success === true;
				});
			} catch {
				// Offline, timed out, blocked, or an unreadable reply: all count as "not delivered".
				return false;
			}
		}
	};
}
