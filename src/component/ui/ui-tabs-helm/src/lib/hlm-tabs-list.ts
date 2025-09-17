import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { BrnTabsList } from '@spartan-ng/brain/tabs';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

export const listVariants = cva(
	'rounded-full overflow-hidden inline-flex w-fit items-center justify-center rounded-full bg-base-bg  text-text-secondary',
	{
		variants: {
			orientation: {
				horizontal: 'space-x-xxs',
				vertical: 'mt-2 flex-col h-fit space-y-1',
			},
		},
		defaultVariants: {
			orientation: 'horizontal',
		},
	},
);
type ListVariants = VariantProps<typeof listVariants>;

@Component({
	selector: 'hlm-tabs-list',
	hostDirectives: [BrnTabsList],
	template: '<ng-content/>',
	host: {
		'[class]': '_computedClass()',
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmTabsList {
	public readonly orientation = input<ListVariants['orientation']>('horizontal');

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(listVariants({ orientation: this.orientation() }), this.userClass()),
	);
}
