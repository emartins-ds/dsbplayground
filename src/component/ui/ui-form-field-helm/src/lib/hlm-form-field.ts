import {
	ChangeDetectionStrategy,
	Component,
	computed,
	contentChild,
	contentChildren,
	effect,
	input,
} from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { BrnFormFieldControl } from '@spartan-ng/brain/form-field';
import { ClassValue } from 'clsx';
import { HlmError } from './hlm-error';
import { HlmLabel } from '../../../ui-label-helm/src';

@Component({
	selector: 'hlm-form-field',
	imports: [HlmLabel],
	template: `
		@if (label()) {
			<label hlmLabel class="label" [for]="labelFor()">
				{{ label() }}
				@if (required()) {
					<span class="text-negative-base">*</span>
				}
			</label>
		}
		<ng-content />

		@switch (_hasDisplayedMessage()) {
			@case ('error') {
				<ng-content select="hlm-error" />
			}
			@default {
				<ng-content select="hlm-hint" />
			}
		}
	`,
	host: {
		'[class]': '_computedClass()',
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
})
export class HlmFormField {
	public readonly label = input<string>('');
	public readonly labelFor = input<string>('');
	public readonly required = input<boolean>(false);
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('space-y-xs block', this.userClass()));
	public readonly control = contentChild(BrnFormFieldControl);

	public readonly errorChildren = contentChildren(HlmError);

	protected readonly _hasDisplayedMessage = computed<'error' | 'hint'>(() =>
		this.errorChildren() && this.errorChildren().length > 0 && this.control()?.errorState() ? 'error' : 'hint',
	);

	constructor() {
		effect(() => {
			if (!this.control()) {
				throw new Error('hlm-form-field must contain a BrnFormFieldControl.');
			}
		});
	}
}
