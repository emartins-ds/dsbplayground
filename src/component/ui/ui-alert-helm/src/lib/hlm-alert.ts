import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

const alertVariants = cva(
	'relative w-full rounded-md px-md py-md text-sm grid has-[>[hlmAlertIcon]]:grid-cols-[calc(theme(spacing.1)*4)_1fr] grid-cols-[0_1fr] has-[>[hlmAlertIcon]]:gap-x-md gap-y-xs items-start [&>[hlmAlertIcon]]:size-md [&>[hlmAlertIcon]]:text-current',
	{
		variants: {
			variant: {
				default: 'bg-secondary-100 text-text-primary [&>[hlmAlertIcon]]:text-secondary-500',
				success: 'bg-positive-light text-text-primary [&>[hlmAlertIcon]]:text-positive-base',
				warning: 'bg-warning-light text-text-primary [&>[hlmAlertIcon]]:text-warning-base',
				destructive:
					'bg-negative-light text-text-primary [&>[hlmAlertIcon]]:text-negative-base',
			},
		},
		defaultVariants: {
			variant: 'success',
		},
	},
);

export type AlertVariants = VariantProps<typeof alertVariants>;

@Directive({
	selector: '[hlmAlert]',
	host: {
		role: 'alert',
		'[class]': '_computedClass()',
	},
})
export class HlmAlert {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm(alertVariants({ variant: this.variant() }), this.userClass()));

	public readonly variant = input<AlertVariants['variant']>('success');
}
