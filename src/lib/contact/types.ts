export interface TicketFormValues {
	passengerName: string;
	passengerEmail: string;
	inquiryType: string;
	message: string;
}

/** Add 'own-api' here when the backend sender exists (and widen the analytics event type to match). */
export type MessageSenderId = 'web3forms';

/** Anything that can deliver a contact message. The form only knows this interface. */
export interface MessageSender {
	/** Used for analytics, so you can see which route messages arrive by. */
	readonly id: MessageSenderId;
	/** Resolves to true only when delivery is confirmed. Never throws. */
	send(message: TicketFormValues): Promise<boolean>;
}
