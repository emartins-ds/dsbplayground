/* 
Some issues with this one functionally. Probably don't copy paste it, but styling like background color, border color, and corner radius are here. 
For my demo, I had to add a delay to the open function because the background color wasnt loading right away. Also, the animations are not working on open.
*/

import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	Renderer2,
	computed,
	effect,
	inject,
	input,
	signal,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { hlm, injectExposedSideProvider, injectExposesStateProvider } from '@spartan-ng/brain/core';
import { BrnSheetClose } from '@spartan-ng/brain/sheet';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';
import { HlmSheetClose } from './hlm-sheet-close';

export const sheetVariants = cva(
	'bg-base-bg fixed z-50 flex flex-col gap-md shadow-bottom-sheet transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
	{
		variants: {
			side: {
				top: 'inset-x-0 top-0 h-auto border-base-border border-r border-l border-b translate-y-full data-[state=open]:translate-y-0',
				bottom:
					'translate-y-full data-[state=open]:translate-y-0 inset-x-0 bottom-0 h-auto border-t border-r border-l border-base-border rounded-t-lg',
				left: 'inset-y-0 left-0 h-full w-3/4 border-r  border-base-border -translate-x-full data-[state=open]:translate-x-0',
				right: 'inset-y-0 right-0 h-full w-3/4 border-l  border-base-border translate-x-full data-[state=open]:translate-x-0',
			},
		},
		defaultVariants: {
			side: 'right',
		},
	},
);

@Component({
	selector: 'hlm-sheet-content',
	imports: [HlmSheetClose, BrnSheetClose, NgIcon, HlmIcon],
	providers: [provideIcons({ lucideX })],
	host: {
		'[class]': '_computedClass()',
		'[attr.data-state]': 'state()',
	},
	template: `
		<ng-content />
		<button brnSheetClose hlm>
			<span class="sr-only">Close</span>
			<ng-icon hlm size="sm" name="lucideX" />
		</button>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmSheetContent {
	private readonly _stateProvider = injectExposesStateProvider({ host: true });
	private readonly _sideProvider = injectExposedSideProvider({ host: true });
	public state = this._stateProvider.state ?? signal('closed');
	private readonly _renderer = inject(Renderer2);
	private readonly _element = inject(ElementRef);

	constructor() {
		effect(() => {
			this._renderer.setAttribute(this._element.nativeElement, 'data-state', this.state());
		});
	}

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(sheetVariants({ side: this._sideProvider.side() }), this.userClass()),
	);
}
