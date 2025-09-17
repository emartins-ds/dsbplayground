import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { BrnTabsTrigger } from '@spartan-ng/brain/tabs';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmTabsTrigger]',
	hostDirectives: [{ directive: BrnTabsTrigger, inputs: ['brnTabsTrigger: hlmTabsTrigger', 'disabled'] }],
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmTabsTrigger {
	public readonly triggerFor = input.required<string>({ alias: 'hlmTabsTrigger' });
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'data-[state=active]:bg-primary-base data-[state=active]:rounded-full bg-primary-light data-[state=active]:text-text-on-primary focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-text-secondary inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-sm border border-transparent px-lg py-xs medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-selected [&_ng-icon]:pointer-events-none [&_ng-icon]:shrink-0 [&_ng-icon]:text-base',
			this.userClass(),
		),
	);
}
