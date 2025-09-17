import { Directive, computed, input, signal } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';
import { injectBrnButtonConfig } from './hlm-button.token';

export const buttonVariants = cva(
	'inline-flex gap-sm items-center justify-center whitespace-nowrap rounded-md text-md transition-[colors] disabled:pointer-events-none disabled:opacity-50 [&_ng-icon]:pointer-events-none shrink-0 [&_ng-icon]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-negative-base/20 aria-invalid:border-destructive cursor-pointer',
	{
		variants: {
			variant: {
				default: 'bg-primary-base text-text-on-primary shadow-xs hover:bg-primary-base/80',
				destructive:
					'bg-negative-base text-white shadow-xs hover:bg-negative-base/80 focus-visible:ring-negative-base/20',
				outline:
					'border border-primary-dark text-primary-dark bg-base-bg shadow-xs hover:bg-primary-light hover:text-primary-dark ',
				secondary: 'bg-primary-light text-text-primary shadow-xs hover:bg-primary-base/30',
				ghost: 'text-primary-dark hover:bg-primary-light hover:text-primary-dark',
				link: 'p-0! h-auto! text-primary-dark underline-offset-4 underline',
			},
			size: {
				default: 'h-9 px-lg py-sm' ,
				sm: 'h-8 rounded-md gap-xs px-md',
				lg: 'h-10 rounded-md px-xl',
				icon: 'size-8',
				full: 'h-10 px-xl w-full truncate',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

@Directive({
	selector: '[hlmBtn]',
	exportAs: 'hlmBtn',
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmButton {
	private readonly _config = injectBrnButtonConfig();

	private readonly _additionalClasses = signal<ClassValue>('');

	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm(buttonVariants({ variant: this.variant(), size: this.size() }), this.userClass(), this._additionalClasses()),
	);

	public readonly variant = input<ButtonVariants['variant']>(this._config.variant);

	public readonly size = input<ButtonVariants['size']>(this._config.size);

	setClass(classes: string): void {
		this._additionalClasses.set(classes);
	}
}
