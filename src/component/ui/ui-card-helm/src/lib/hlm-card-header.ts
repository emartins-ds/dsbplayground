import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmCardHeader]',
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmCardHeader {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'@container/card-header grid auto-rows-min items-center gap-x-md gap-y-sm px-md has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-md',
			this.userClass(),
		),
	);
}
