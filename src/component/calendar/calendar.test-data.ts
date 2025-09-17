import { ProviderSchedule } from './calendar.types';

// Booking constraints configuration
export interface BookingConstraints {
  maxTimeOut: {
    value: number;
    unit: 'week' | 'month' | 'year';
  };
  minTimeInAdvance: {
    value: number;
    unit: 'hour' | 'day' | 'none';
  };
}

// Example booking constraints - can be configured per provider
export const DEFAULT_BOOKING_CONSTRAINTS: BookingConstraints = {
  maxTimeOut: {
    value: 3,
    unit: 'month'
  },
  minTimeInAdvance: {
    value: 2,
    unit: 'day'
  }
};

// Generate random booking constraints for demo purposes
export function getRandomBookingConstraints(): BookingConstraints {
  // Random max time out - bias towards longer periods for better testing
  const maxTimeUnits: Array<'week' | 'month' | 'year'> = ['month', 'year']; // Remove 'week' to avoid short windows
  const maxTimeUnit = maxTimeUnits[Math.floor(Math.random() * maxTimeUnits.length)];
  
  let maxTimeValue: number;
  switch (maxTimeUnit) {
    case 'week':
      maxTimeValue = Math.floor(Math.random() * 9) + 1; // 1-9 weeks
      break;
    case 'month':
      maxTimeValue = Math.floor(Math.random() * 12) + 6; // 6-18 months (minimum 6 months)
      break;
    case 'year':
      maxTimeValue = Math.floor(Math.random() * 3) + 1; // 1-3 years (minimum 1 year)
      break;
  }
  
  // Random min time in advance
  const minTimeUnits: Array<'hour' | 'day' | 'none'> = ['hour', 'day', 'none'];
  const minTimeUnit = minTimeUnits[Math.floor(Math.random() * minTimeUnits.length)];
  
  let minTimeValue: number;
  switch (minTimeUnit) {
    case 'hour':
      minTimeValue = Math.floor(Math.random() * 5) + 1; // 1-5 hours
      break;
    case 'day':
      minTimeValue = Math.floor(Math.random() * 5) + 1; // 1-5 days
      break;
    case 'none':
      minTimeValue = 0;
      break;
  }
  
  return {
    maxTimeOut: {
      value: maxTimeValue,
      unit: maxTimeUnit
    },
    minTimeInAdvance: {
      value: minTimeValue,
      unit: minTimeUnit
    }
  };
}

// Get dynamic booking constraints (random on each reload)
export function getDynamicBookingConstraints(): BookingConstraints {
  return getRandomBookingConstraints();
}

// Helper function to calculate the maximum bookable date
export function getMaxBookableDate(constraints: BookingConstraints = getDynamicBookingConstraints()): Date {
  const today = new Date();
  const maxDate = new Date(today);
  
  switch (constraints.maxTimeOut.unit) {
    case 'week':
      maxDate.setDate(today.getDate() + (constraints.maxTimeOut.value * 7));
      break;
    case 'month':
      maxDate.setMonth(today.getMonth() + constraints.maxTimeOut.value);
      break;
    case 'year':
      maxDate.setFullYear(today.getFullYear() + constraints.maxTimeOut.value);
      break;
  }
  
  return maxDate;
}

// Helper function to check if a date is within the minimum advance time
export function isWithinMinAdvanceTime(date: Date, constraints: BookingConstraints = getDynamicBookingConstraints()): boolean {
  const today = new Date();
  
  // Always prevent booking in the past (regardless of min advance time setting)
  if (date < today) {
    return false;
  }
  
  // If no minimum advance time is set, only check that it's not in the past
  if (constraints.minTimeInAdvance.unit === 'none') {
    return true;
  }
  
  // Check minimum advance time constraint
  const minDate = new Date(today);
  
  switch (constraints.minTimeInAdvance.unit) {
    case 'hour':
      minDate.setHours(today.getHours() + constraints.minTimeInAdvance.value);
      break;
    case 'day':
      minDate.setDate(today.getDate() + constraints.minTimeInAdvance.value);
      break;
  }
  
  return date >= minDate;
}

// Mock provider schedule data
const mockSchedule: ProviderSchedule = {
  providerId: 'provider-1',
  providerName: 'Sarah Johnson',
  workingDays: [
    {
      date: '2024-01-15',
      isWorking: true,
      availableSlots: [
        { time: '09:00', isAvailable: true, isBooked: false },
        { time: '10:00', isAvailable: true, isBooked: false },
        { time: '11:00', isAvailable: false, isBooked: true },
        { time: '14:00', isAvailable: true, isBooked: false },
        { time: '15:00', isAvailable: true, isBooked: false },
        { time: '16:00', isAvailable: false, isBooked: true }
      ],
      totalSlots: 6,
      bookedSlots: 2
    },
    {
      date: '2024-01-16',
      isWorking: true,
      availableSlots: [
        { time: '09:00', isAvailable: false, isBooked: true },
        { time: '10:00', isAvailable: false, isBooked: true },
        { time: '11:00', isAvailable: false, isBooked: true },
        { time: '14:00', isAvailable: true, isBooked: false },
        { time: '15:00', isAvailable: true, isBooked: false },
        { time: '16:00', isAvailable: true, isBooked: false }
      ],
      totalSlots: 6,
      bookedSlots: 3
    },
    {
      date: '2024-01-17',
      isWorking: true,
      availableSlots: [
        { time: '09:00', isAvailable: true, isBooked: false },
        { time: '10:00', isAvailable: true, isBooked: false },
        { time: '11:00', isAvailable: true, isBooked: false },
        { time: '14:00', isAvailable: true, isBooked: false },
        { time: '15:00', isAvailable: true, isBooked: false },
        { time: '16:00', isAvailable: true, isBooked: false }
      ],
      totalSlots: 6,
      bookedSlots: 0
    }
  ]
};

// Function to get availability for a specific date
export function getAvailabilityForDate(date: Date): 'available' | 'not-available' {
  // Check if date is within minimum advance time
  if (!isWithinMinAdvanceTime(date)) {
    return 'not-available';
  }
  
  // Check if date is within maximum bookable time
  const maxBookableDate = getMaxBookableDate();
  if (date > maxBookableDate) {
    return 'not-available';
  }
  
  // For demo purposes, return random availability
  // In real app, this would check the actual schedule
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  if (isWeekend) {
    return Math.random() > 0.3 ? 'available' : 'not-available';
  }
  
  return Math.random() > 0.2 ? 'available' : 'not-available';
}

export { mockSchedule };
