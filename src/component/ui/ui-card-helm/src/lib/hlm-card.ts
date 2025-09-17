import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

export const cardVariants = cva('bg-base-bg text-text-primary flex flex-col gap-sm rounded-lg border border-base-border py-md', {
	variants: {
		selected: {
			true: 'shadow-selected',
			false: '',
		},
	},
	defaultVariants: {
		selected: false,
	},
});
export type CardVariants = VariantProps<typeof cardVariants>;

@Directive({
	selector: '[hlmCard]',
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmCard {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	public readonly selected = input<boolean>(false);
	
	protected _computedClass = computed(() => hlm(cardVariants({ selected: this.selected() }), this.userClass()));
}
