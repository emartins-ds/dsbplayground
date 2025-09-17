import { BooleanInput } from '@angular/cdk/coercion';
import {
	ChangeDetectionStrategy,
	Component,
	booleanAttribute,
	computed,
	forwardRef,
	input,
	model,
	output,
	signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BrnCheckbox } from '@spartan-ng/brain/checkbox';
import { hlm } from '@spartan-ng/brain/core';
import type { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import type { ClassValue } from 'clsx';

export const HLM_CHECKBOX_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => HlmCheckbox),
	multi: true,
};

@Component({
	selector: 'hlm-checkbox',
	imports: [BrnCheckbox, FontAwesomeModule],
	template: `
		<brn-checkbox
			[id]="id()"
			[name]="name()"
			[class]="_computedClass()"
			[checked]="checked()"
			[disabled]="_state().disabled()"
			[required]="required()"
			[aria-label]="ariaLabel()"
			[aria-labelledby]="ariaLabelledby()"
			[aria-describedby]="ariaDescribedby()"
			(changed)="_handleChange()"
			(touched)="_onTouched?.()"
		>
			@if (checked()) {
				<span class="flex items-center justify-center text-current transition-none">
					<fa-icon [icon]="faCheck" class="text-sm" />
				</span>
			}
		</brn-checkbox>
	`,
	host: {
		class: 'contents peer',
		'[attr.id]': 'null',
		'[attr.aria-label]': 'null',
		'[attr.aria-labelledby]': 'null',
		'[attr.aria-describedby]': 'null',
		'[attr.data-disabled]': '_state().disabled() ? "" : null',
	},
	providers: [HLM_CHECKBOX_VALUE_ACCESSOR],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmCheckbox implements ControlValueAccessor {
	protected readonly faCheck = faCheck;
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm(
			'peer border-base-input data-[state=checked]:bg-primary-dark data-[state=checked]:text-white data-[state=checked]:border-primary-dark focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-negative-base/20 aria-invalid:border-negative-base size-5 shrink-0 rounded-sm border outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 cursor-default',
			this.userClass(),
			this._state().disabled() ? 'cursor-not-allowed opacity-50' : '',
		),
	);

	/** Used to set the id on the underlying brn element. */
	public readonly id = input<string | null>(null);

	/** Used to set the aria-label attribute on the underlying brn element. */
	public readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });

	/** Used to set the aria-labelledby attribute on the underlying brn element. */
	public readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });

	/** Used to set the aria-describedby attribute on the underlying brn element. */
	public readonly ariaDescribedby = input<string | null>(null, { alias: 'aria-describedby' });

	/** The checked state of the checkbox. */
	public readonly checked = model<CheckboxValue>(false);

	/** The name attribute of the checkbox. */
	public readonly name = input<string | null>(null);

	/** Whether the checkbox is required. */
	public readonly required = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	/** Whether the checkbox is disabled. */
	public readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	protected readonly _state = computed(() => ({
		disabled: signal(this.disabled()),
	}));

	public readonly changed = output<boolean>();

	protected _onChange?: ChangeFn<CheckboxValue>;
	protected _onTouched?: TouchFn;

	protected _handleChange(): void {
		if (this._state().disabled()) return;

		const previousChecked = this.checked();
		this.checked.set(previousChecked === 'indeterminate' ? true : !previousChecked);
		this._onChange?.(!previousChecked);
		this.changed.emit(!previousChecked);
	}

	/** CONTROL VALUE ACCESSOR */
	writeValue(value: CheckboxValue): void {
		this.checked.set(!!value);
	}

	registerOnChange(fn: ChangeFn<CheckboxValue>): void {
		this._onChange = fn;
	}

	registerOnTouched(fn: TouchFn): void {
		this._onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this._state().disabled.set(isDisabled);
	}
}

type CheckboxValue = boolean | 'indeterminate';
