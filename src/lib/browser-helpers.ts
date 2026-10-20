export function downloadFile(url: string, fileName: string): void {
	const link = document.createElement('a');
	link.href = url;
	link.download = fileName;
	document.body.append(link);
	link.click();
	link.remove();
}

export function openInNewTab(url: string): void {
	window.open(url, '_blank', 'noopener,noreferrer');
}

export function copyText(text: string): Promise<void> | undefined {
	return navigator.clipboard?.writeText(text);
}

/** True when keystrokes are going into a text field, so global shortcuts must stay out of the way. */
export function isTypingTarget(target: EventTarget | null): boolean {
	return (
		target instanceof HTMLElement &&
		(target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
	);
}
