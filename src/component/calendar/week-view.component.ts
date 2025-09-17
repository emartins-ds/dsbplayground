import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarDay, CalendarMonth } from './calendar.types';
import { DateService } from './date.service';

@Component({
  selector: 'app-week-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './week-view.component.html',
  styleUrls: ['./week-view.component.css']
})
export class WeekViewComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input() calendarMonth: CalendarMonth | null = null;
  @Output() daySelected = new EventEmitter<CalendarDay>();
  @Output() monthChanged = new EventEmitter<Date>();
  
  @ViewChild('scrollContainerRef', { static: false }) scrollContainerRef!: ElementRef;
  
  private currentVisibleMonth: number = -1;
  private currentVisibleYear: number = -1;
  private scrollTimeout: any = null;
  
  constructor(private dateService: DateService) {}
  
  ngOnInit() {
    // Initial visible month will be set after view init
  }
  
  ngAfterViewInit() {
    // Set initial visible month after view is initialized
    setTimeout(() => {
      // Initialize with the current month from the service
      const currentDate = this.dateService.currentDate();
      this.currentVisibleMonth = currentDate.getMonth();
      this.currentVisibleYear = currentDate.getFullYear();
      
      // Auto-select the first day in the booking window
      this.autoSelectFirstDay();
      
      // Now that we're initialized, add the scroll event handler
      if (this.scrollContainerRef?.nativeElement) {
        this.scrollContainerRef.nativeElement.addEventListener('scroll', () => this.onScroll());
      }
      
    }, 0);
  }
  
  ngOnChanges(changes: SimpleChanges) {
    // Watch for changes in calendarMonth to detect month navigation from month selector
    if (changes['calendarMonth'] && this.calendarMonth) {
      const currentDate = this.dateService.currentDate();
      const newMonth = currentDate.getMonth();
      const newYear = currentDate.getFullYear();
      
      // Only process if we've already been initialized
      if (this.currentVisibleMonth !== -1 && this.currentVisibleYear !== -1) {
        // If the month changed from month selector, scroll to the first day of the new month
        if (newMonth !== this.currentVisibleMonth || newYear !== this.currentVisibleYear) {
          // Update our tracking
          this.currentVisibleMonth = newMonth;
          this.currentVisibleYear = newYear;
          
          // Scroll to the first day of the new month
          setTimeout(() => this.scrollToMonth(newMonth, newYear), 100);
        }
      } else {
        // During initial load, just update the tracking
        this.currentVisibleMonth = newMonth;
        this.currentVisibleYear = newYear;
      }
      
    }
  }
  
  ngOnDestroy() {
    // Clean up scroll timeout
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
  }
  
  // Get all days for horizontal scrolling (only within booking window)
  getCurrentWeekDays(): CalendarDay[] {
    if (!this.calendarMonth) {
      return [];
    }

    // Return ALL days from the calendarMonth data
    // The calendar component already generates the correct range
    // We just need to filter out days that are clearly outside the booking window
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    
    const maxBookableDate = this.dateService.getMaxBookableDate();
    maxBookableDate.setHours(23, 59, 59, 999); // End of max bookable date
    
    const filteredDays = this.calendarMonth.days
      .filter(day => {
        // Only include days that are today or in the future
        if (day.date < today) {
          return false;
        }
        
        // Only include days within the booking window
        if (day.date > maxBookableDate) {
          return false;
        }
        
        return true; // Don't filter by bookability here, just date range
      })
      .map(day => ({
        ...day,
        isSelected: this.isDaySelected(day)
      }));
    
    return filteredDays;
  }
  
  // Update the visible month based on scroll position (throttled)
  updateVisibleMonth() {
    // Don't run during initialization
    if (this.currentVisibleMonth === -1 || this.currentVisibleYear === -1) {
      return;
    }
    
    if (!this.scrollContainerRef?.nativeElement || !this.calendarMonth) return;
    
    const containerRect = this.scrollContainerRef.nativeElement.getBoundingClientRect();
    const containerLeft = containerRect.left;
    const containerRight = containerRect.right;
    
    // Get the actual day elements to see which ones are visible
    const dayElements = this.scrollContainerRef.nativeElement.querySelectorAll('.week-day-wrapper');
    if (dayElements.length === 0) return;
    
    // Find the first visible day (leftmost visible day)
    let firstVisibleDay: CalendarDay | null = null;
    let firstVisibleDayIndex = -1;
    
    for (let i = 0; i < dayElements.length; i++) {
      const dayElement = dayElements[i];
      const rect = dayElement.getBoundingClientRect();
      
      // Check if this day is significantly visible (more than 50% visible)
      const visibleWidth = Math.min(rect.right, containerRight) - Math.max(rect.left, containerLeft);
      const dayWidth = rect.width;
      
      if (visibleWidth > dayWidth * 0.5 && this.calendarMonth && i < this.calendarMonth.days.length) {
        const day = this.calendarMonth.days[i];
        
        // Track the first visible day
        if (firstVisibleDay === null) {
          firstVisibleDay = day;
          firstVisibleDayIndex = i;
        }
      }
    }
    
    // If we found a visible day, check if it's the first day of a new month
    if (firstVisibleDay && firstVisibleDayIndex >= 0) {
      const newMonth = firstVisibleDay.date.getMonth();
      const newYear = firstVisibleDay.date.getFullYear();
      
      // Check if this is the first day of the month
      const isFirstDayOfMonth = firstVisibleDay.date.getDate() === 1;
      
      // Only emit if month/year actually changed AND it's the first day of the month
      if ((newMonth !== this.currentVisibleMonth || newYear !== this.currentVisibleYear) && isFirstDayOfMonth) {
        
        // Update our tracking
        this.currentVisibleMonth = newMonth;
        this.currentVisibleYear = newYear;
        
        // Emit the month change to update the month selector
        this.monthChanged.emit(firstVisibleDay.date);
      }
    }
  }
  
  private onScroll() {
    // Clear existing timeout
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    
    // Set new timeout to throttle scroll events
    this.scrollTimeout = setTimeout(() => {
      this.processScroll();
    }, 100); // 100ms debounce
  }
  
  private processScroll() {
    if (!this.scrollContainerRef?.nativeElement || !this.calendarMonth) return;
    
    const scrollLeft = this.scrollContainerRef.nativeElement.scrollLeft;
    const containerWidth = this.scrollContainerRef.nativeElement.clientWidth;
    const scrollWidth = this.scrollContainerRef.nativeElement.scrollWidth;
    
    // Handle scroll boundaries
    if (scrollLeft < 0) {
      this.scrollContainerRef.nativeElement.scrollLeft = 0;
      return;
    }
    
    if (scrollLeft + containerWidth > scrollWidth) {
      this.scrollContainerRef.nativeElement.scrollLeft = scrollWidth - containerWidth;
      return;
    }
    
    // Get all the day elements to check visibility
    const dayElements = this.scrollContainerRef.nativeElement.querySelectorAll('.week-day-wrapper');
    
    if (dayElements.length === 0) return;
    
    // Find the first day that's significantly visible (leftmost visible day)
    let firstVisibleDay: CalendarDay | null = null;
    
    for (let i = 0; i < dayElements.length; i++) {
      const dayElement = dayElements[i] as HTMLElement;
      const dayRect = dayElement.getBoundingClientRect();
      const containerRect = this.scrollContainerRef.nativeElement.getBoundingClientRect();
      
      // Check if this day is significantly visible (more than 30% visible)
      const visibleWidth = Math.min(dayRect.right, containerRect.right) - Math.max(dayRect.left, containerRect.left);
      const dayWidth = dayElement.offsetWidth;
      
      if (visibleWidth > dayWidth * 0.3) {
        // This is the first visible day
        if (i < this.calendarMonth.days.length) {
          firstVisibleDay = this.calendarMonth.days[i];
        }
        break;
      }
    }
    
    if (!firstVisibleDay) {
      return;
    }
    
    // Check if this is the first day of a month
    const isFirstDayOfMonth = firstVisibleDay.date.getDate() === 1;
    
    // Also check if we're at the very beginning or end of the booking window
    const visibleDays = this.getCurrentWeekDays();
    const isFirstDayInWindow = visibleDays.indexOf(firstVisibleDay) === 0;
    const isLastDayInWindow = visibleDays.indexOf(firstVisibleDay) === visibleDays.length - 1;
    
    // Update month if:
    // 1. We're at the first day of a month, OR
    // 2. We're at the very beginning/end of the booking window
    if (isFirstDayOfMonth || isFirstDayInWindow || isLastDayInWindow) {
      const newMonth = firstVisibleDay.date.getMonth();
      const newYear = firstVisibleDay.date.getFullYear();
      
      if (newMonth !== this.currentVisibleMonth || newYear !== this.currentVisibleYear) {
        
        this.currentVisibleMonth = newMonth;
        this.currentVisibleYear = newYear;
        
        // Update the month selector without triggering any scrolling
        this.monthChanged.emit(firstVisibleDay.date);
      }
    }
  }
  
  isDaySelected(day: CalendarDay): boolean {
    const selectedDate = this.dateService.selectedDate();
    return selectedDate ? this.isSameDate(day.date, selectedDate) : false;
  }

  private isSameDate(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  getDayClasses(day: CalendarDay): string {
    let classes = 'week-day-wrapper';
    
    if (day.isSelected) {
      classes += ' selected';
    }
    
    if (day.availability === 'available') {
      classes += ' availability-available';
    } else if (day.availability === 'not-available') {
      classes += ' availability-not-available';
    }
    
    if (!day.isCurrentMonth) {
      classes += ' other-month';
    }
    
    return classes;
  }

  getTodayIndicatorColor(day: CalendarDay): string {
    if (day.isSelected) {
      return 'var(--color-text-on-primary)';
    } else if (day.availability === 'available') {
      return 'var(--color-text-primary)';
    } else {
      return 'var(--color-text-secondary)';
    }
  }

  onDayClick(day: CalendarDay) {
    if (day.isCurrentMonth) {
      this.daySelected.emit(day);
    }
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return this.isSameDate(date, today);
  }

  trackByDate(index: number, day: CalendarDay): number {
    return day.date.getTime();
  }

  // Scroll to the first day of a specific month
  scrollToMonth(month: number, year: number) {
    
    if (!this.scrollContainerRef?.nativeElement || !this.calendarMonth) {
      return;
    }
    
    // Get the visible days (filtered by booking window)
    const visibleDays = this.getCurrentWeekDays();
    
    // Find the first day of the specified month within the visible days
    const firstDayOfMonth = visibleDays.find(day => 
      day.date.getMonth() === month && 
      day.date.getFullYear() === year &&
      day.date.getDate() === 1
    );
    
    if (firstDayOfMonth) {
      
      // Find the corresponding DOM element
      const dayElements = this.scrollContainerRef.nativeElement.querySelectorAll('.week-day-wrapper');
      
      // Find the index of this day in the visible days array
      const visibleDayIndex = visibleDays.indexOf(firstDayOfMonth);
      
      if (visibleDayIndex >= 0 && dayElements[visibleDayIndex]) {
        const dayElement = dayElements[visibleDayIndex] as HTMLElement;
        const dayLeft = dayElement.offsetLeft;
        
        // Scroll to the first day of the month
        this.scrollContainerRef.nativeElement.scrollTo({
          left: dayLeft,
          behavior: 'smooth'
        });
      }
    }
  }

  private autoSelectFirstDay() {
    if (!this.calendarMonth) return;

    // Get the visible days (filtered by booking window)
    const visibleDays = this.getCurrentWeekDays();
    
    if (visibleDays.length > 0) {
      // Select the first day in the booking window
      const firstDay = visibleDays[0];
      this.dateService.setSelectedDate(firstDay.date);
      this.daySelected.emit(firstDay);
    }
  }
}
