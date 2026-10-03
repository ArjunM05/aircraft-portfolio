<script lang="ts" module>
	import type { ContactSection } from '#lib/data/sections.js';

	export type BoardingPassDetails = ContactSection['boardingPass'];
	export type FallbackLink = ContactSection['profileLinks'][number];
	export type SubmissionResult = 'sent' | 'failed';

	type SubmissionState = 'idle' | 'sending' | SubmissionResult;

	const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
	const REQUEST_TIMEOUT_MS = 10_000;
	const COPY_FEEDBACK_DURATION_MS = 4000;
	const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
	const SUBJECT_PREFIX = '[Portfolio]';

	interface TicketFormValues {
		passengerName: string;
		passengerEmail: string;
		inquiryType: string;
		message: string;
	}

	type ValidatedField = 'passengerName' | 'passengerEmail' | 'message';
	type FieldErrors = Partial<Record<ValidatedField, string>>;

	function validateTicketForm(values: TicketFormValues): FieldErrors {
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

	function buildSubject(values: TicketFormValues): string {
		return `${SUBJECT_PREFIX} ${values.inquiryType} - ${values.passengerName.trim()}`;
	}

	function buildMessageBody(values: TicketFormValues): string {
		return (
			`${values.message.trim()}\n\n--\n` +
			`${values.passengerName.trim()}\n${values.passengerEmail.trim()}`
		);
	}

	function buildMailtoUrl(recipientEmail: string, values: TicketFormValues): string {
		return (
			`mailto:${recipientEmail}` +
			`?subject=${encodeURIComponent(buildSubject(values))}` +
			`&body=${encodeURIComponent(buildMessageBody(values))}`
		);
	}

	/** Posts the ticket to Web3Forms. Resolves to true only when the service confirms delivery. */
	async function sendToWeb3Forms(accessKey: string, values: TicketFormValues): Promise<boolean> {
		const abortController = new AbortController();
		const timeoutId = setTimeout(() => abortController.abort(), REQUEST_TIMEOUT_MS);

		try {
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
				signal: abortController.signal
			});

			const result = await response.json();
			return response.ok && result.success === true;
		} catch {
			// Offline, timed out, blocked, or an unreadable reply: all count as "not delivered".
			return false;
		} finally {
			clearTimeout(timeoutId);
		}
	}
</script>

<script lang="ts">
	import { tick, untrack } from 'svelte';

	interface Props {
		/** Ticket wording and fixed details (airline name, gate, seat and so on). */
		details: BoardingPassDetails;
		/** Your address. Used for the fallback options. */
		recipientEmail: string;
		/** Web3Forms access key. When missing, the form goes straight to the fallback options. */
		accessKey?: string;
		/** Extra ways to reach you if automatic delivery fails (LinkedIn, GitHub and so on). */
		fallbackLinks?: FallbackLink[];
		/** Called after every delivery attempt. Handy for testing. */
		onSubmissionResult?: (result: SubmissionResult) => void;
	}

	let {
		details,
		recipientEmail,
		accessKey,
		fallbackLinks = [],
		onSubmissionResult
	}: Props = $props();

	// Unique prefix, so two passes on one page (for example plain view) never share element ids.
	const fieldIdPrefix = $props.id();

	let formElement: HTMLFormElement;

	// untrack: the default inquiry type is read once, when the form first appears.
	let values = $state<TicketFormValues>({
		passengerName: '',
		passengerEmail: '',
		inquiryType: untrack(() => details.inquiryTypes[0]),
		message: ''
	});

	/** A hidden checkbox that only bots tick. */
	let honeypotChecked = $state(false);
	let fieldErrors = $state<FieldErrors>({});
	let submissionState = $state<SubmissionState>('idle');
	let copyFeedback = $state('');
	let copyFeedbackTimer: ReturnType<typeof setTimeout> | undefined;

	const isSending = $derived(submissionState === 'sending');
	const isSent = $derived(submissionState === 'sent');
	const isFailed = $derived(submissionState === 'failed');

	const mailtoUrl = $derived(buildMailtoUrl(recipientEmail, values));
	const copyableMessage = $derived(
		`To: ${recipientEmail}\nSubject: ${buildSubject(values)}\n\n${buildMessageBody(values)}`
	);

	$effect(() => () => clearTimeout(copyFeedbackTimer));

	async function issueTicket(event: SubmitEvent) {
		event.preventDefault();
		if (isSending) return;

		fieldErrors = validateTicketForm(values);
		if (Object.keys(fieldErrors).length > 0) {
			submissionState = 'idle';
			// Wait for aria-invalid to update, then move focus to the first problem.
			await tick();
			formElement.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
			return;
		}

		// Bots fill in every field, including the hidden one. Pretend it worked and send nothing.
		if (honeypotChecked) {
			submissionState = 'sent';
			return;
		}

		if (!accessKey) {
			submissionState = 'failed';
			onSubmissionResult?.('failed');
			return;
		}

		submissionState = 'sending';
		const wasDelivered = await sendToWeb3Forms(accessKey, values);
		submissionState = wasDelivered ? 'sent' : 'failed';
		onSubmissionResult?.(submissionState);
	}

	function sendAnotherMessage() {
		values.message = '';
		submissionState = 'idle';
	}

	async function copyToClipboard(text: string, successMessage: string) {
		clearTimeout(copyFeedbackTimer);

		try {
			await navigator.clipboard.writeText(text);
			copyFeedback = successMessage;
		} catch {
			copyFeedback = 'Your browser blocked copying. Select the text and copy it manually.';
		}

		copyFeedbackTimer = setTimeout(() => (copyFeedback = ''), COPY_FEEDBACK_DURATION_MS);
	}
</script>

<section
	class="boarding-pass"
	class:issued={isSent}
	aria-label="Contact form, styled as a boarding pass"
>
	<header class="pass-header">
		<span class="airline-name">{details.airlineName}</span>
		<span class="pass-title">BOARDING PASS / CONTACT</span>
	</header>

	<form bind:this={formElement} onsubmit={issueTicket} novalidate>
		<fieldset class="pass-body" disabled={isSending}>
			<input
				type="checkbox"
				class="honeypot"
				name="botcheck"
				bind:checked={honeypotChecked}
				tabindex="-1"
				autocomplete="off"
				aria-hidden="true"
			/>

			<div class="field">
				<label for="{fieldIdPrefix}-name">Passenger</label>
				<input
					id="{fieldIdPrefix}-name"
					type="text"
					bind:value={values.passengerName}
					placeholder="Your name"
					autocomplete="name"
					aria-invalid={fieldErrors.passengerName ? 'true' : undefined}
					aria-describedby={fieldErrors.passengerName ? `${fieldIdPrefix}-name-error` : undefined}
				/>
				{#if fieldErrors.passengerName}
					<p class="field-error" id="{fieldIdPrefix}-name-error">{fieldErrors.passengerName}</p>
				{/if}
			</div>

			<div class="field">
				<label for="{fieldIdPrefix}-email">Your email</label>
				<input
					id="{fieldIdPrefix}-email"
					type="email"
					bind:value={values.passengerEmail}
					placeholder="you@company.com"
					autocomplete="email"
					aria-invalid={fieldErrors.passengerEmail ? 'true' : undefined}
					aria-describedby={fieldErrors.passengerEmail ? `${fieldIdPrefix}-email-error` : undefined}
				/>
				{#if fieldErrors.passengerEmail}
					<p class="field-error" id="{fieldIdPrefix}-email-error">{fieldErrors.passengerEmail}</p>
				{/if}
			</div>

			<div class="route" aria-hidden="true">
				<div class="route-endpoint">
					<small>From</small>
					<strong>YOU</strong>
				</div>
				<span class="route-plane">&#9992;&#xFE0E;</span>
				<div class="route-endpoint route-endpoint--destination">
					<small>To</small>
					<strong>{details.destinationCode}</strong>
					<small>{details.destinationName}</small>
				</div>
			</div>

			<div class="field">
				<label for="{fieldIdPrefix}-class">Cabin class</label>
				<select id="{fieldIdPrefix}-class" bind:value={values.inquiryType}>
					{#each details.inquiryTypes as inquiryType (inquiryType)}
						<option value={inquiryType}>{inquiryType}</option>
					{/each}
				</select>
			</div>

			<div class="field">
				<label for="{fieldIdPrefix}-message">Cargo manifest (your message)</label>
				<textarea
					id="{fieldIdPrefix}-message"
					rows="4"
					bind:value={values.message}
					placeholder="What would you like to send?"
					aria-invalid={fieldErrors.message ? 'true' : undefined}
					aria-describedby={fieldErrors.message ? `${fieldIdPrefix}-message-error` : undefined}
				></textarea>
				{#if fieldErrors.message}
					<p class="field-error" id="{fieldIdPrefix}-message-error">{fieldErrors.message}</p>
				{/if}
			</div>

			<dl class="flight-details">
				<div>
					<dt>Flight</dt>
					<dd>{details.flightCode}</dd>
				</div>
				<div>
					<dt>Gate</dt>
					<dd>{details.gate}</dd>
				</div>
				<div>
					<dt>Seat</dt>
					<dd>{details.seat}</dd>
				</div>
				<div>
					<dt>Boarding</dt>
					<dd>{details.boardingStatus}</dd>
				</div>
			</dl>
		</fieldset>

		<div class="perforation" aria-hidden="true"></div>

		<div class="pass-stub">
			<div class="barcode" aria-hidden="true"></div>

			{#if isSent}
				<button type="button" class="issue-button" onclick={sendAnotherMessage}>Send another</button
				>
			{:else}
				<button type="submit" class="issue-button" disabled={isSending}>
					{#if isSending}Sending...{:else if isFailed}Try again{:else}Issue ticket{/if}
				</button>
			{/if}
		</div>
	</form>

	<div class="status-area" aria-live="polite">
		{#if isSending}
			<p class="status-note">Boarding in progress. Sending your message...</p>
		{:else if isSent}
			<p class="status-note">
				Ticket delivered. Thank you, {values.passengerName.trim() || 'traveller'}. I will reply to
				{values.passengerEmail.trim() || 'your email address'}.
			</p>
		{/if}
	</div>

	{#if isFailed}
		<div class="fallback-panel" role="alert">
			<p class="fallback-title">
				{accessKey
					? 'The ticket could not be delivered automatically.'
					: 'Automatic delivery is not set up on this site.'}
				Your message is safe here. Use any option below:
			</p>

			<label for="{fieldIdPrefix}-backup">Your message, ready to copy</label>
			<textarea
				id="{fieldIdPrefix}-backup"
				class="backup-message"
				rows="5"
				readonly
				value={copyableMessage}
				onfocus={(event) => event.currentTarget.select()}></textarea>

			<div class="fallback-actions">
				<button type="button" onclick={() => copyToClipboard(copyableMessage, 'Message copied.')}>
					Copy message
				</button>
				<a href={mailtoUrl}>Open in mail app</a>
				<button
					type="button"
					onclick={() => copyToClipboard(recipientEmail, 'Email address copied.')}
				>
					Copy my email
				</button>
				{#each fallbackLinks as link (link.url)}
					<a href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>
				{/each}
			</div>

			<p class="copy-feedback" aria-live="polite">{copyFeedback}</p>
		</div>
	{/if}

	<div class="stamp" aria-hidden="true">CLEARED<br />FOR TAKEOFF</div>
</section>

<style>
	.boarding-pass {
		position: relative;
		margin: 14px 0;
		overflow: hidden;
		border-radius: 8px;
		background: var(--paper);
		color: var(--ink);
		box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
	}

	/* ---------- header ---------- */
	.pass-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px 16px;
		background: #0f2f57;
		color: #fff;
		border-bottom: 4px solid var(--amber);
	}

	.airline-name {
		font: 600 20px var(--sans);
		letter-spacing: 0.08em;
	}

	.pass-title {
		font: 11px var(--mono);
	}

	/* ---------- fields ---------- */
	.pass-body {
		min-width: 0;
		margin: 0;
		padding: 4px 16px 10px;
		border: 0;
	}

	.pass-body:disabled {
		opacity: 0.6;
	}

	.honeypot {
		display: none;
	}

	.field {
		margin: 10px 0;
	}

	label {
		display: block;
		font: 11px var(--mono);
		text-transform: uppercase;
		color: #5a6b80;
	}

	input,
	select,
	textarea {
		display: block;
		width: 100%;
		padding: 4px 0;
		border: 0;
		border-bottom: 1.5px dashed #8a97a8;
		border-radius: 0;
		background: transparent;
		color: var(--ink);
		/* 16px keeps iPhones from zooming in when a field is focused. */
		font: 16px var(--mono);
		resize: vertical;
	}

	input:focus,
	select:focus,
	textarea:focus {
		outline: none;
		border-bottom-color: #d9822b;
	}

	input[aria-invalid='true'],
	textarea[aria-invalid='true'] {
		border-bottom-color: #b3261e;
		border-bottom-style: solid;
	}

	.field-error {
		margin: 4px 0 0;
		font: 12px var(--mono);
		color: #b3261e;
	}

	/* ---------- route display ---------- */
	.route {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 12px 0;
	}

	.route-endpoint small {
		display: block;
		font: 10px var(--mono);
		text-transform: uppercase;
		color: #5a6b80;
	}

	.route-endpoint strong {
		font: 600 28px var(--sans);
	}

	.route-endpoint--destination {
		text-align: right;
	}

	.route-plane {
		font-size: 22px;
		color: #d9822b;
	}

	/* ---------- flight details ---------- */
	.flight-details {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 6px;
		margin: 12px 0 0;
		padding-top: 8px;
		border-top: 1px solid #cfc8b6;
	}

	.flight-details div {
		min-width: 0;
	}

	dt {
		font: 10px var(--mono);
		text-transform: uppercase;
		color: #5a6b80;
	}

	dd {
		margin: 0;
		font: 600 14px var(--mono);
	}

	/* ---------- tear-off line and stub ---------- */
	.perforation {
		position: relative;
		margin: 4px 0 14px;
		border-top: 2px dashed #9aa7b8;
	}

	/* Half-circle notches at both ends, filled with the panel colour. */
	.perforation::before,
	.perforation::after {
		content: '';
		position: absolute;
		top: -11px;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: var(--bg2);
	}
	.perforation::before {
		left: -10px;
	}
	.perforation::after {
		right: -10px;
	}

	.pass-stub {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 0 16px 14px;
	}

	.barcode {
		flex: 1;
		height: 34px;
		background: repeating-linear-gradient(
			90deg,
			var(--ink) 0 2px,
			transparent 2px 4px,
			var(--ink) 4px 5px,
			transparent 5px 9px,
			var(--ink) 9px 12px,
			transparent 12px 14px
		);
	}

	.issue-button {
		padding: 8px 16px;
		border: 1px solid var(--ink);
		background: var(--amber);
		color: var(--ink);
		font: 600 16px var(--sans);
		cursor: pointer;
	}

	.issue-button:hover,
	.issue-button:focus-visible {
		background: var(--ink);
		color: var(--amber);
		outline: none;
	}

	.issue-button:disabled {
		opacity: 0.6;
		cursor: wait;
	}

	/* ---------- status and fallback ---------- */
	.status-area:empty {
		display: none;
	}

	.status-note {
		margin: 0;
		padding: 0 16px 14px;
		font: 12px/1.5 var(--mono);
	}

	.fallback-panel {
		margin: 0 16px 16px;
		padding: 12px;
		border: 1.5px solid #b3261e;
		background: rgba(179, 38, 30, 0.06);
	}

	.fallback-title {
		margin: 0 0 8px;
		font: 12px/1.5 var(--mono);
		color: #7a1812;
	}

	.backup-message {
		margin-top: 4px;
		padding: 6px;
		border: 1px dashed #8a97a8;
		font-size: 13px;
	}

	.fallback-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 10px;
	}

	.fallback-actions button,
	.fallback-actions a {
		padding: 5px 10px;
		border: 1px solid var(--ink);
		background: transparent;
		color: var(--ink);
		font: 12px var(--mono);
		text-decoration: none;
		cursor: pointer;
	}

	.fallback-actions button:hover,
	.fallback-actions a:hover,
	.fallback-actions button:focus-visible,
	.fallback-actions a:focus-visible {
		background: var(--ink);
		color: var(--paper);
		outline: none;
	}

	.copy-feedback {
		min-height: 1.5em;
		margin: 8px 0 0;
		font: 12px var(--mono);
		color: var(--ink);
	}

	/* ---------- stamp ---------- */
	.stamp {
		position: absolute;
		top: 70px;
		right: 14px;
		padding: 4px 10px;
		border: 3px solid #c0392b;
		border-radius: 4px;
		background: rgba(244, 239, 227, 0.7);
		color: #c0392b;
		font: 700 18px/1.1 var(--mono);
		opacity: 0;
		transform: rotate(-12deg) scale(2);
		pointer-events: none;
	}

	.boarding-pass.issued .stamp {
		animation: stamp-down 0.45s forwards;
	}

	@keyframes stamp-down {
		to {
			opacity: 0.92;
			transform: rotate(-12deg) scale(1);
		}
	}
</style>
