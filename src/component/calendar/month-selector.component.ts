import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateService } from './date.service';

@Component({
  selector: 'app-month-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-sm">
      <h3 class="text-gray-900 w-24 text-center">{{ getMonthYearDisplay() }}</h3>
      <div class="flex items-center gap-2">
        <button 
          class="flex items-center justify-center w-6 h-6 border-none bg-transparent rounded-md text-gray-500 cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
          [disabled]="isPreviousMonthDisabled()"
          (click)="previousMonth()"
          aria-label="Previous month">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        
        <button 
          class="flex items-center justify-center w-6 h-6 border-none bg-transparent rounded-md text-gray-500 cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
          [disabled]="isNextMonthDisabled()"
          (click)="nextMonth()"
          aria-label="Next month">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  `
})
export class MonthSelectorComponent {
  constructor(private dateService: DateService) {}
  
  // Get current date from service
  get currentDate() {
    return this.dateService.currentDate();
  }
  
  // Format month and year for display (e.g., "Jul 2025")
  getMonthYearDisplay(): string {
    const currentDate = this.currentDate;
    return currentDate.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  }
  
  // Check if previous month navigation should be disabled
  isPreviousMonthDisabled(): boolean {
    return this.dateService.isPreviousMonthDisabled();
  }

  // Check if next month navigation should be disabled
  isNextMonthDisabled(): boolean {
    return this.dateService.isNextMonthDisabled();
  }
  
  // Method to navigate to previous month
  previousMonth() {
    if (this.isPreviousMonthDisabled()) return;
    
    const currentDate = this.currentDate;
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    
    // Update the service
    this.dateService.setCurrentDate(newDate);
  }
  
  // Method to navigate to next month
  nextMonth() {
    if (this.isNextMonthDisabled()) return;
    
    const currentDate = this.currentDate;
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    
    // Update the service
    this.dateService.setCurrentDate(newDate);
  }
}
