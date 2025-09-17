export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  availability: 'available' | 'not-available';
  isSelected: boolean;
}

export interface CalendarMonth {
  year: number;
  month: number;
  monthName: string;
  days: CalendarDay[];
}

export interface ProviderSchedule {
  providerId: string;
  providerName: string;
  workingDays: WorkingDay[];
}

export interface WorkingDay {
  date: string; // ISO date string
  isWorking: boolean;
  availableSlots: TimeSlot[];
  totalSlots: number;
  bookedSlots: number;
}

export interface TimeSlot {
  time: string; // HH:mm format
  isAvailable: boolean;
  isBooked: boolean;
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  providerId: string;
  patientId: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}
