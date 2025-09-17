import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarDay, CalendarMonth } from './calendar.types';
import { DateService } from './date.service';

@Component({
  selector: 'app-month-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.css']
})
export class MonthViewComponent {
  @Input() calendarMonth: CalendarMonth | null = null;
  @Output() daySelected = new EventEmitter<CalendarDay>();
  
  constructor(private dateService: DateService) {}
  
  // Method to check if a day is selected
  isDaySelected(day: CalendarDay): boolean {
    if (!day.isCurrentMonth) return false;
    
    const selectedDate = this.dateService.selectedDate();
    return selectedDate ? this.isSameDate(day.date, selectedDate) : false;
  }
  
  // Helper method to compare dates
  private isSameDate(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }
  
  // Get CSS classes for a day
  getDayClasses(day: CalendarDay): string {
    let classes = 'calendar-day-wrapper';
    
    if (!day.isCurrentMonth) {
      classes += ' other-month';
    }
    
    if (day.isToday) {
      classes += ' today';
    }
    
    if (this.isDaySelected(day)) {
      classes += ' selected';
    }
    
    classes += ` availability-${day.availability}`;
    
    return classes;
  }
  
  // Get today indicator color
  getTodayIndicatorColor(day: CalendarDay): string {
    if (!day.isToday) return '';
    
    if (day.availability === 'available') {
      if (this.isDaySelected(day)) {
        return 'var(--color-text-on-primary)'; // White text on primary background when selected
      } else {
        return 'var(--color-text-primary)'; // Dark text for available (default and hover)
      }
    } else {
      return 'var(--color-text-secondary)'; // Secondary text color for not available (all states)
    }
  }
  
  // Handle day click
  onDayClick(day: CalendarDay) {
    if (day.isCurrentMonth) {
      this.daySelected.emit(day);
    }
  }
  
  // Track by function for ngFor optimization
  trackByDate(index: number, day: CalendarDay): number {
    return day.date.getTime();
  }
  
  // Group days into rows of 7 for the calendar grid
  getCalendarRows(): CalendarDay[][] {
    if (!this.calendarMonth) return [];
    
    // Get only current month days and pad with previous/next month days to fill weeks
    const currentMonthDays = this.calendarMonth.days.filter(day => day.isCurrentMonth);
    
    if (currentMonthDays.length === 0) return [];
    
    // Find the first day of the first week (Sunday)
    const firstDay = currentMonthDays[0];
    const firstDayOfWeek = firstDay.date.getDay(); // 0 = Sunday
    
    // Get days from previous month to fill the first week
    const previousMonthDays: CalendarDay[] = [];
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(firstDay.date);
      prevDate.setDate(prevDate.getDate() - (firstDayOfWeek - i));
      
      const prevDay: CalendarDay = {
        date: prevDate,
        isCurrentMonth: false,
        isToday: this.isToday(prevDate),
        availability: 'not-available',
        isSelected: false
      };
      previousMonthDays.unshift(prevDay);
    }
    
    // Get days from next month to fill the last week
    const lastDay = currentMonthDays[currentMonthDays.length - 1];
    const lastDayOfWeek = lastDay.date.getDay(); // 0 = Sunday
    const daysToAdd = 6 - lastDayOfWeek;
    
    const nextMonthDays: CalendarDay[] = [];
    for (let i = 1; i <= daysToAdd; i++) {
      const nextDate = new Date(lastDay.date);
      nextDate.setDate(nextDate.getDate() + i);
      
      const nextDay: CalendarDay = {
        date: nextDate,
        isCurrentMonth: false,
        isToday: this.isToday(nextDate),
        availability: 'not-available',
        isSelected: false
      };
      nextMonthDays.push(nextDay);
    }
    
    // Combine all days
    const allDays = [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];
    
    // Group into rows of 7
    const rows: CalendarDay[][] = [];
    for (let i = 0; i < allDays.length; i += 7) {
      rows.push(allDays.slice(i, i + 7));
    }
    
    return rows;
  }
  
  // Helper method to check if a date is today
  private isToday(date: Date): boolean {
    const today = new Date();
    return this.isSameDate(date, today);
  }
  
  // Track by function for rows
  trackByRow(index: number, row: CalendarDay[]): number {
    return index;
  }

  // Get the days for the current month view
  getCurrentMonthDays(): CalendarDay[] {
    if (!this.calendarMonth) return [];
    
    // Filter to show only current month days
    return this.calendarMonth.days.filter(day => day.isCurrentMonth);
  }
}
