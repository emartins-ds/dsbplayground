import { Component, signal, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheckCircle, faExclamationTriangle, faInfoCircle, faXmarkCircle, faShield, faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle as faCheckCircleOutline } from '@fortawesome/free-regular-svg-icons';
import {
  HlmAlertDescription,
  HlmAlert,
  HlmAlertIcon,
  HlmAlertTitle
} from '../../component/ui/ui-alert-helm/src';
import { HlmButton } from '../../component/ui/ui-button-helm/src';
import { HlmBadge } from '../../component/ui/ui-badge-helm/src';
import { HlmCheckboxWithLabel } from '../../component/ui/ui-checkbox-helm/src';
import { HlmInput } from '../../component/ui/ui-input-helm/src';
import { HlmFormFieldModule } from '../../component/ui/ui-form-field-helm/src';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { BrnSheetContent, BrnSheetTrigger } from '@spartan-ng/brain/sheet';
import {
  HlmSheet,
  HlmSheetContent,
  HlmSheetDescription,
  HlmSheetFooter,
  HlmSheetHeader,
  HlmSheetTitle
} from '../../component/ui/ui-sheet-helm/src';

import {
  HlmCard,
  HlmCardHeader,
  HlmCardFooter,
  HlmCardTitle,
  HlmCardDescription,
  HlmCardContent,
  HlmCardAction
} from '../../component/ui/ui-card-helm/src';

@Component({
  selector: 'app-components-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, HlmAlert, HlmAlertTitle, HlmAlertDescription, HlmAlertIcon, HlmButton, HlmBadge, HlmCheckboxWithLabel, HlmInput, HlmFormFieldModule, BrnSelectImports, HlmSelectImports, BrnSheetContent, BrnSheetTrigger, HlmSheet, HlmSheetContent, HlmSheetDescription, HlmSheetFooter, HlmSheetHeader, HlmSheetTitle, HlmCard, HlmCardHeader, HlmCardFooter, HlmCardTitle, HlmCardDescription, HlmCardContent, HlmCardAction],
  templateUrl: '../ui-components/components-page.component.html',
  styleUrl: '../ui-components/components-page.component.css'
})
export class ComponentsPageComponent implements OnInit {
  @ViewChild('leftSheet') leftSheet: any;
  @ViewChild('loginSheet') loginSheet: any;
  @ViewChild('accountSheet') accountSheet: any;
  
  // Test form control for error state
  protected readonly errorTestControl = new FormControl('', [Validators.required, () => ({ alwaysError: true })]);
  
  // Card selection state
  protected readonly isLongHaircutSelected = signal(false);
	
	// Chip selection state
	protected readonly selectedChip = signal<string | null>(null);
  
  // Solid icons
  protected readonly faCheckCircle = faCheckCircle;
  protected readonly faExclamationTriangle = faExclamationTriangle;
  protected readonly faInfoCircle = faInfoCircle;
  protected readonly faXmarkCircle = faXmarkCircle;
  protected readonly faShield = faShield;
  protected readonly faCheck = faCheck;
  protected readonly faPlus = faPlus;
  
  // Outline icons
  protected readonly faCheckCircleOutline = faCheckCircleOutline;

  // Toggle card selection
  protected toggleLongHaircutSelection(): void {
    this.isLongHaircutSelected.update(current => !current);
  }
	
	// Select a chip (only one can be selected at a time)
	protected selectChip(chipValue: string): void {
		this.selectedChip.set(chipValue);
	}

  // Get button icon based on selection state
  protected getButtonIcon() {
    return this.isLongHaircutSelected() ? this.faCheck : '+';
  }

  ngOnInit(): void {
    // Mark the control as touched to trigger error state
    this.errorTestControl.markAsTouched();
  }

  openLeftSheetWithDelay(): void {
    setTimeout(() => {
      if (this.leftSheet) {
        this.leftSheet.open();
      }
    }, 100); // 100ms delay
  }

  openLoginSheetWithDelay(): void {
    setTimeout(() => {
      if (this.loginSheet) {
        this.loginSheet.open();
      }
    }, 100); // 100ms delay
  }

  openAccountSheetWithDelay(): void {
    setTimeout(() => {
      if (this.accountSheet) {
        this.accountSheet.open();
      }
    }, 100); // 100ms delay
  }
}
