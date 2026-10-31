import type { TicketFormValues } from './types.js';

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

export type ValidatedField = 'passengerName' | 'passengerEmail' | 'message';
export type FieldErrors = Partial<Record<ValidatedField, string>>;

/** Returns one message per invalid field. An empty object means the form is valid. */
export function validateTicketForm(values: TicketFormValues): FieldErrors {
	const errors: FieldErrors = {};

	if (!values.passengerName.trim()) {
		errors.passengerName = 'Please add your name.';
	}
	if (!EMAIL_PATTERN.test(values.passengerEmail.trim())) {
		errors.passengerEmail = 'Please add a valid email address so I can reply.';
	}
	if (!values.message.trim()) {
		errors.message = 'Please write a short message.';
	}

	return errors;
}
