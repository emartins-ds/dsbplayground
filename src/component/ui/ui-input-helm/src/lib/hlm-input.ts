import {
	computed,
	Directive,
	type DoCheck,
	effect,
	forwardRef,
	inject,
	Injector,
	input,
	linkedSignal,
	untracked,
} from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { hlm } from '@spartan-ng/brain/core';
import { BrnFormFieldControl } from '@spartan-ng/brain/form-field';
import { ErrorStateMatcher, ErrorStateTracker } from '@spartan-ng/brain/forms';
import { cva, VariantProps } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

export const inputVariants = cva(
	'input file:text-text-primary placeholder:text-text-placeholder selection:bg-primary-light selection:text-text-primary border-base-input flex h-9 w-full min-w-0 rounded-sm border bg-transparent px-md py-xs transition-color outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-secondary-600 focus-visible:ring-secondary-600/50 focus-visible:ring-[1px]',
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
type InputVariants = VariantProps<typeof inputVariants>;

@Directive({
	selector: '[hlmInput]',
	host: {
		'[class]': '_computedClass()',
	},
	providers: [
		{
			provide: BrnFormFieldControl,
			useExisting: forwardRef(() => HlmInput),
		},
	],
})
export class HlmInput implements BrnFormFieldControl, DoCheck {
	public readonly error = input<InputVariants['error']>('auto');

	protected readonly _state = linkedSignal(() => ({ error: this.error() }));

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(inputVariants({ error: this._state().error }), this.userClass()),
	);

	private readonly _injector = inject(Injector);

	public readonly ngControl: NgControl | null = this._injector.get(NgControl, null);

	private readonly _errorStateTracker: ErrorStateTracker;

	private readonly _defaultErrorStateMatcher = inject(ErrorStateMatcher);
	private readonly _parentForm = inject(NgForm, { optional: true });
	private readonly _parentFormGroup = inject(FormGroupDirective, { optional: true });

	public readonly errorState = computed(() => this._errorStateTracker.errorState());

	constructor() {
		this._errorStateTracker = new ErrorStateTracker(
			this._defaultErrorStateMatcher,
			this.ngControl,
			this._parentFormGroup,
			this._parentForm,
		);

		effect(() => {
			const error = this._errorStateTracker.errorState();
			untracked(() => {
				if (this.ngControl) {
					const shouldShowError = error && this.ngControl.invalid && (this.ngControl.touched || this.ngControl.dirty);
					this._errorStateTracker.errorState.set(shouldShowError ? true : false);
					this.setError(shouldShowError ? true : 'auto');
				}
			});
		});
	}

	ngDoCheck() {
		this._errorStateTracker.updateErrorState();
	}

	setError(error: InputVariants['error']) {
		this._state.set({ error });
	}
}
