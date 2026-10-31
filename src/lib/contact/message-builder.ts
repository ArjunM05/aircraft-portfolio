import type { TicketFormValues } from './types.js';

const SUBJECT_PREFIX = '[Portfolio]';

export function buildSubject(values: TicketFormValues): string {
	return `${SUBJECT_PREFIX} ${values.inquiryType} - ${values.passengerName.trim()}`;
}

export function buildMessageBody(values: TicketFormValues): string {
	return (
		`${values.message.trim()}\n\n--\n` +
		`${values.passengerName.trim()}\n${values.passengerEmail.trim()}`
	);
}

export function buildMailtoUrl(recipientEmail: string, values: TicketFormValues): string {
	return (
		`mailto:${recipientEmail}` +
		`?subject=${encodeURIComponent(buildSubject(values))}` +
		`&body=${encodeURIComponent(buildMessageBody(values))}`
	);
}

/** The whole email as plain text, for the "copy message" fallback. */
export function buildCopyableMessage(recipientEmail: string, values: TicketFormValues): string {
	return `To: ${recipientEmail}\nSubject: ${buildSubject(values)}\n\n${buildMessageBody(values)}`;
}
