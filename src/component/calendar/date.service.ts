import { Injectable, signal } from '@angular/core';
import { getDynamicBookingConstraints, getMaxBookableDate, isWithinMinAdvanceTime } from './calendar.test-data';
import { CalendarDay } from './calendar.types';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  private _currentDate = signal(new Date());
  
  // Generate constraints once when service initializes
  private _bookingConstraints = getDynamicBookingConstraints();
  
  // Store availability data for all dates
  private _availabilityData = signal<Map<string, 'available' | 'not-available'>>(new Map());
  
  // Store selected date
  private _selectedDate = signal<Date | null>(null);
  
  // Getter for the current date signal
  get currentDate() {
    return this._currentDate;
  }
  
  // Getter for the stable booking constraints
  get bookingConstraints() {
    return this._bookingConstraints;
  }
  
  // Getter for availability data
  get availabilityData() {
    return this._availabilityData;
  }
  
  // Getter for selected date
  get selectedDate() {
    return this._selectedDate;
  }
  
  constructor() {
    console.log('🏗️ DateService constructor called');
    console.log('📅 Booking constraints:', this._bookingConstraints);
    
    const maxBookableDate = getMaxBookableDate(this._bookingConstraints);
    console.log('📅 Max bookable date calculated:', {
      date: maxBookableDate.toDateString(),
      timeFromNow: `${Math.round((maxBookableDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`
    });
    
    this.initializeAvailabilityData();
    this.initializeSelectedDate();
  }
  
  // Initialize availability data for all dates in the booking window
  private initializeAvailabilityData() {
    const availabilityMap = new Map<string, 'available' | 'not-available'>();
    const today = new Date();
    const maxBookableDate = getMaxBookableDate(this._bookingConstraints);
    
    // Generate availability for all dates in the booking window
    for (let d = new Date(today); d <= maxBookableDate; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().split('T')[0];
      const availability = this.generateAvailabilityForDate(d);
      availabilityMap.set(dateString, availability);
    }
    
    this._availabilityData.set(availabilityMap);
  }
  
  // Generate availability for a specific date (deterministic)
  private generateAvailabilityForDate(date: Date): 'available' | 'not-available' {
    // Check if date is bookable based on constraints
    if (!this.isDateBookable(date)) {
      return 'not-available';
    }
    
    // Use deterministic approach based on date
    const dateString = date.toISOString().split('T')[0];
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
      const char = dateString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    const randomValue = Math.abs(hash) % 100;
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    if (isWeekend) {
      return randomValue > 30 ? 'available' : 'not-available';
    }
    
    return randomValue > 20 ? 'available' : 'not-available';
  }
  
  // Get availability for a specific date
  getAvailabilityForDate(date: Date): 'available' | 'not-available' {
    const dateString = date.toISOString().split('T')[0];
    return this._availabilityData().get(dateString) || 'not-available';
  }
  
  // Get the first bookable date in the booking window
  getFirstBookableDate(): Date {
    const today = new Date();
    const maxBookableDate = getMaxBookableDate(this._bookingConstraints);
    
    for (let d = new Date(today); d <= maxBookableDate; d.setDate(d.getDate() + 1)) {
      if (this.isDateBookable(d) && this.getAvailabilityForDate(d) === 'available') {
        return new Date(d);
      }
    }
    
    // Fallback to today if no available dates found
    return new Date(today);
  }
  
  // Get the maximum bookable date
  getMaxBookableDate(): Date {
    return getMaxBookableDate(this._bookingConstraints);
  }
  
  // Get the minimum bookable date (today)
  getMinBookableDate(): Date {
    return new Date(); // Today
  }
  
  // Initialize selected date to today (not first bookable date)
  private initializeSelectedDate() {
    // Start with today's date instead of jumping to first bookable date
    const today = new Date();
    
    this._selectedDate.set(today);
    
    // Also set current date to today so month selector shows current month
    this._currentDate.set(today);
  }
  
  // Set selected date
  setSelectedDate(date: Date) {
    this._selectedDate.set(date);
  }
  
  // Method to update the current date
  setCurrentDate(date: Date) {
    this._currentDate.set(date);
  }
  
  // Method to navigate to previous month
  previousMonth() {
    const currentDate = this._currentDate();
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    this._currentDate.set(newDate);
  }
  
  // Method to navigate to next month
  nextMonth() {
    const currentDate = this._currentDate();
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    this._currentDate.set(newDate);
  }
  
  // Check if previous month navigation should be disabled
  isPreviousMonthDisabled(): boolean {
    const currentDate = this._currentDate();
    const today = new Date();
    return currentDate.getFullYear() <= today.getFullYear() && 
           currentDate.getMonth() <= today.getMonth();
  }
  
  // Check if next month navigation should be disabled
  isNextMonthDisabled(): boolean {
    const currentDate = this._currentDate();
    const maxBookableDate = getMaxBookableDate(this._bookingConstraints);
    
    // Check if going to next month would exceed the maximum bookable time
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    return nextMonth > maxBookableDate;
  }
  
  // Check if a specific date is bookable
  isDateBookable(date: Date): boolean {
    return isWithinMinAdvanceTime(date, this._bookingConstraints) && 
           date <= getMaxBookableDate(this._bookingConstraints);
  }
}
