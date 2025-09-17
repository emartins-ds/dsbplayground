import { Component, OnInit, OnChanges, Output, EventEmitter, signal, computed, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarDay, CalendarMonth } from './calendar.types';
import { DateService } from './date.service';
import { MonthViewComponent } from './month-view.component';
import { WeekViewComponent } from './week-view.component';
import { MonthSelectorComponent } from './month-selector.component';
import { HlmTabs, HlmTabsList, HlmTabsTrigger, HlmTabsContent } from '../ui/ui-tabs-helm/src';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, MonthViewComponent, WeekViewComponent, MonthSelectorComponent, HlmTabs, HlmTabsList, HlmTabsTrigger, HlmTabsContent],
  templateUrl: './calendar.component.html'
})
export class CalendarComponent implements OnInit, OnChanges {
  @Output() dateSelected = new EventEmitter<Date>();
  
  currentView = signal<'week' | 'month'>('week'); // Default to week view
  
  constructor(private dateService: DateService) {}
  
  // Computed values - now from service
  get currentDate() {
    return this.dateService.currentDate();
  }
  
  currentMonth = computed(() => this.currentDate);
  currentYear = computed(() => this.currentDate.getFullYear());
  monthName = computed(() => this.getMonthName(this.currentDate.getMonth()));
  
  // Make calendarMonth reactive to date changes
  calendarMonth = computed(() => this.generateCalendarMonth());
  
  ngOnInit() {
    // No longer needed since selected date is managed by service
  }
  
  ngOnChanges(changes: SimpleChanges) {
    // No longer needed since we're using computed
  }
  
  generateCalendarMonth(): CalendarMonth {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    // Always generate a complete month grid
    // Start from the first day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    
    // Find the start of the week containing the first day of the month (Sunday)
    const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
    const weekStart = new Date(firstDayOfMonth);
    weekStart.setDate(firstDayOfMonth.getDate() - firstDayOfWeek);
    
    // Find the end of the month
    const lastDayOfMonth = new Date(year, month + 1, 0); // Last day of current month
    
    // Find the end of the week containing the last day of the month (Saturday)
    const lastDayOfWeek = lastDayOfMonth.getDay(); // 0 = Sunday
    const weekEnd = new Date(lastDayOfMonth);
    weekEnd.setDate(lastDayOfMonth.getDate() + (6 - lastDayOfWeek));
    
    const days: CalendarDay[] = [];
    const currentDate = new Date(weekStart);
    
    // Generate all days for the complete month grid
    while (currentDate <= weekEnd) {
      const isCurrentMonth = currentDate.getMonth() === month;
      const isToday = this.isToday(currentDate);
      
      // For days outside the current month, set availability to 'not-available'
      // For days within the current month, get actual availability
      let availability: 'available' | 'not-available';
      if (isCurrentMonth) {
        // Check if the date is within the booking window
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (currentDate < today) {
          // Past dates are never available
          availability = 'not-available';
        } else {
          // Future dates within current month - get availability from service
          availability = this.dateService.getAvailabilityForDate(currentDate);
        }
      } else {
        // Days from previous/next month are not available
        availability = 'not-available';
      }
      
      days.push({
        date: new Date(currentDate),
        isCurrentMonth,
        isToday,
        availability,
        isSelected: this.dateService.selectedDate() ? this.isSameDate(currentDate, this.dateService.selectedDate()!) : false
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return {
      year,
      month,
      monthName: this.getMonthName(month),
      days
    };
  }
  
  isToday(date: Date): boolean {
    const today = new Date();
    return this.isSameDate(date, today);
  }
  
  isSameDate(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }
  
  getMonthName(month: number): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month];
  }
  
  // Date selection
  selectDate(day: CalendarDay) {
    if (day.isCurrentMonth) {
      this.dateService.setSelectedDate(day.date);
      this.dateSelected.emit(day.date);
      // No need to manually regenerate since calendarMonth is computed
    }
  }
  
  // Handle tab activation
  onTabActivated(tab: string) {
    if (tab === 'week' || tab === 'month') {
      this.currentView.set(tab);
    }
  }
  
  // Handle month changes from week view scrolling
  onWeekViewMonthChanged(date: Date) {
    // Update the current date to match the month being viewed in week view
    this.dateService.setCurrentDate(date);
  }
}
