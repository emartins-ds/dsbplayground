import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { hlm } from '@spartan-ng/brain/core';
import { BrnSelectOption } from '@spartan-ng/brain/select';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-option',
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [{ directive: BrnSelectOption, inputs: ['disabled', 'value'] }],
	host: {
		'[class]': '_computedClass()',
	},
	template: `
		<span class="absolute right-2 flex size-3.5 items-center justify-center">
			@if (this._brnSelectOption.selected()) {
				<fa-icon [icon]="faCheck" class="text-sm" aria-hidden="true" />
			}
		</span>

		<ng-content />
	`,
	imports: [FontAwesomeModule],
	standalone: true,
})
export class HlmSelectOption {
	protected readonly faCheck = faCheck;
	protected readonly _brnSelectOption = inject(BrnSelectOption, { host: true });
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'data-[active]:bg-base-bg data-[active]:text-text-primary data-[active]:bg-primary-light relative flex w-full cursor-default items-center gap-xs rounded-sm py-xs pr-3xl pl-xs text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>fa-icon]:pointer-events-none [&>fa-icon]:shrink-0 [&>fa-icon]:h-5 [&>fa-icon]:w-5 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-sm',
			this.userClass(),
		),
	);
}
