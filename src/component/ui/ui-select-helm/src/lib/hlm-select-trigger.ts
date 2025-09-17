import { ChangeDetectionStrategy, Component, computed, contentChild, inject, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { hlm } from '@spartan-ng/brain/core';
import { BrnSelect, BrnSelectTrigger } from '@spartan-ng/brain/select';
import { cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

export const selectTriggerVariants = cva(
	`border-base-input [&>fa-icon]:text-text-secondary focus-visible:border-ring focus-visible:ring-secondary-600 flex w-fit items-center justify-between gap-sm rounded-sm border bg-transparent px-md py-sm input whitespace-nowrap transition-[color] outline-none focus-visible:ring-[.5px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 [&>fa-icon]:pointer-events-none [&>fa-icon]:shrink-0 [&>fa-icon]:h-5 [&>fa-icon]:w-5`,
	{
		variants: {
			error: {
				auto: '[&.ng-invalid.ng-touched]:text-negative-dark [&.ng-invalid.ng-touched]:border-negative-base [&.ng-invalid.ng-touched]:focus-visible:ring-negative-base',
				true: 'text-negative-dark border-negative-base focus-visible:ring-negative-base',
			},
		},
		defaultVariants: {
			error: 'auto',
		},
	},
);

@Component({
	selector: 'hlm-select-trigger',
	imports: [BrnSelectTrigger, FontAwesomeModule],
	template: `
		<button [class]="_computedClass()" #button hlmInput brnSelectTrigger type="button" [attr.data-size]="size()">
			<ng-content />
			@if (_icon()) {
				<ng-content select="fa-icon" />
			} @else {
				<fa-icon [icon]="faChevronDown" class="ml-xs flex-none text-sm" />
			}
		</button>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
})
export class HlmSelectTrigger {
	protected readonly faChevronDown = faChevronDown;
	protected readonly _icon = contentChild(FontAwesomeModule);

	protected readonly _brnSelect = inject(BrnSelect, { optional: true });

	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	public readonly size = input<'default' | 'sm'>('default');

	protected readonly _computedClass = computed(() =>
		hlm(selectTriggerVariants({ error: this._brnSelect?.errorState() }), this.userClass()),
	);
}
