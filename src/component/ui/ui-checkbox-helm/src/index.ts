import { NgModule } from '@angular/core';

import { HlmCheckbox } from './lib/hlm-checkbox';
import { HlmCheckboxWithLabel } from './lib/hlm-checkbox-with-label';

export * from './lib/hlm-checkbox';
export * from './lib/hlm-checkbox-with-label';

export const HlmCheckboxImports = [HlmCheckbox, HlmCheckboxWithLabel] as const;
@NgModule({
	imports: [...HlmCheckboxImports],
	exports: [...HlmCheckboxImports],
})
export class HlmCheckboxModule {}
