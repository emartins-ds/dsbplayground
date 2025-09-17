import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from '../../component/calendar/calendar.component';
import { DateService } from '../../component/calendar/date.service';
import { getMaxBookableDate } from '../../component/calendar/calendar.test-data';

@Component({
  selector: 'app-calendar-demo',
  standalone: true,
  imports: [CommonModule, CalendarComponent],
  templateUrl: './calendar-demo.component.html'
})
export class CalendarDemoComponent {
  constructor(public dateService: DateService) {}
  
  onDateSelected(date: Date) {
    // Update the service's selected date
    this.dateService.setSelectedDate(date);
    console.log('Selected date:', date);
  }
  
  // Get the selected date from the service
  get selectedDate() {
    return this.dateService.selectedDate();
  }
  
  // Get booking constraints for display
  getBookingConstraints() {
    return this.dateService.bookingConstraints;
  }
  
  // Get max bookable date for display
  getMaxBookableDate() {
    return getMaxBookableDate(this.dateService.bookingConstraints);
  }
  
  // Format the constraints for display
  getMaxTimeOutDisplay(): string {
    const constraints = this.getBookingConstraints();
    const { value, unit } = constraints.maxTimeOut;
    
    if (unit === 'week') {
      return `${value} ${value === 1 ? 'week' : 'weeks'}`;
    } else if (unit === 'month') {
      return `${value} ${value === 1 ? 'month' : 'months'}`;
    } else if (unit === 'year') {
      return `${value} ${value === 1 ? 'year' : 'years'}`;
    }
    return `${value} ${unit}`;
  }
  
  getMinTimeInAdvanceDisplay(): string {
    const constraints = this.getBookingConstraints();
    const { value, unit } = constraints.minTimeInAdvance;
    
    if (unit === 'none') {
      return 'None';
    } else if (unit === 'hour') {
      return `${value} ${value === 1 ? 'hour' : 'hours'}`;
    } else if (unit === 'day') {
      return `${value} ${value === 1 ? 'day' : 'days'}`;
    }
    return `${value} ${unit}`;
  }
}
