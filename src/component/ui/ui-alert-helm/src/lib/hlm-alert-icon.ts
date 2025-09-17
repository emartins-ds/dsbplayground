import { Directive } from '@angular/core';

@Directive({
	selector: '[hlmAlertIcon]',
	host: {
		style: 'font-size: 1rem;',
	}
})
export class HlmAlertIcon {}
