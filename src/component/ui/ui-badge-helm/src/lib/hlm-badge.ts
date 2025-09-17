import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

const badgeVariants = cva(
	'inline-flex items-center justify-center rounded-sm border border-primary-dark w-fit whitespace-nowrap shrink-0 gap-xs [&_fa-icon]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-all overflow-hidden',
	{
		variants: {
			variant: {
				default: 'border-transparent bg-primary-base text-text-on-primary [a&]:hover:bg-primary-base/90',
				secondary: 'border-transparent bg-primary-light text-text-primary [a&]:hover:bg-primary-light/90',
				destructive:
					'border-transparent bg-negative-base text-white [a&]:hover:bg-negative-base/90 focus-visible:ring-negative-base/20 ',
				outline: 'text-primary-dark [a&]:hover:bg-primary-light',
				chip: 'border-transparent lg-normal bg-secondary-100 text-text-primary hover:bg-primary-light transition-colors',
			},
			size: {
				sm: 'px-sm h-[24px] text-sm font-semibold [&_fa-icon]:size-4.5',
				default: 'px-lg h-[32px] text-md font-semibold [&_fa-icon]:size-5.5',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;

@Directive({
	selector: '[hlmBadge]',
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmBadge {
	protected readonly _computedClass = computed(() => {
		const baseClasses = badgeVariants({ variant: this.variant(), size: this.size() });
		const chipClasses = this.variant() === 'chip' ? this._getChipClasses() : '';
		return hlm(baseClasses, chipClasses, this.userClass());
	});

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	public readonly variant = input<BadgeVariants['variant']>('default');
	public readonly size = input<BadgeVariants['size']>('default');
	public readonly selected = input<boolean>(false);

	private _getChipClasses(): string {
		if (this.selected()) {
			return 'bg-primary-base text-text-on-primary lg-medium hover:text-text-on-primary hover:bg-primary-base/90 rounded-full';
		}
		return 'lg-normal';
	}
}
