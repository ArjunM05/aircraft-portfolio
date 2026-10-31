import { describe, expect, it } from 'vitest';
import type { TicketFormValues } from './types.js';
import { validateTicketForm } from './validation.js';

function form(overrides: Partial<TicketFormValues> = {}): TicketFormValues {
	return {
		passengerName: 'Ada Lovelace',
		passengerEmail: 'ada@example.com',
		inquiryType: 'Job opportunity',
		message: 'Hello!',
		...overrides
	};
}

describe('validateTicketForm', () => {
	it('accepts a complete form', () => {
		expect(validateTicketForm(form())).toEqual({});
	});

	it('asks for a name, ignoring spaces', () => {
		expect(validateTicketForm(form({ passengerName: '' })).passengerName).toBeDefined();
		expect(validateTicketForm(form({ passengerName: '   ' })).passengerName).toBeDefined();
	});

	it('asks for a message, ignoring spaces', () => {
		expect(validateTicketForm(form({ message: ' \n ' })).message).toBeDefined();
	});

	it('rejects addresses that cannot be replied to', () => {
		for (const email of ['', 'ada', 'ada@example', 'ada@', '@example.com', 'a da@example.com']) {
			expect(validateTicketForm(form({ passengerEmail: email })).passengerEmail).toBeDefined();
		}
	});

	it('accepts an address with surrounding spaces', () => {
		expect(validateTicketForm(form({ passengerEmail: '  ada@example.com ' }))).toEqual({});
	});

	it('reports every problem at once', () => {
		const errors = validateTicketForm(
			form({ passengerName: '', passengerEmail: 'x', message: '' })
		);

		expect(Object.keys(errors).sort()).toEqual(['message', 'passengerEmail', 'passengerName']);
	});
});
