/**
 * Single source of truth for clinic operating hours.
 * Keep in sync with the public hours shown on the contact section.
 *
 * Monday–Friday: 9:30 AM – 7:00 PM
 * Saturday:      9:30 AM – 6:00 PM
 * Sunday:        Closed
 */

export type TimeOfDay = { hour: number; minute: number };

export type DayHours = {
  open: TimeOfDay;
  close: TimeOfDay;
};

/** 0 = Sunday … 6 = Saturday (JS Date.getDay()) */
export const CLINIC_HOURS_BY_DAY: Record<number, DayHours | null> = {
  0: null, // Sunday — closed
  1: { open: { hour: 9, minute: 30 }, close: { hour: 19, minute: 0 } }, // Mon
  2: { open: { hour: 9, minute: 30 }, close: { hour: 19, minute: 0 } }, // Tue
  3: { open: { hour: 9, minute: 30 }, close: { hour: 19, minute: 0 } }, // Wed
  4: { open: { hour: 9, minute: 30 }, close: { hour: 19, minute: 0 } }, // Thu
  5: { open: { hour: 9, minute: 30 }, close: { hour: 19, minute: 0 } }, // Fri
  6: { open: { hour: 9, minute: 30 }, close: { hour: 18, minute: 0 } }, // Sat
};

/** Minutes between bookable start times */
export const SLOT_INTERVAL_MINUTES = 30;

/**
 * Last bookable start time is this many minutes before closing,
 * so a session can finish within operating hours.
 */
export const LAST_SLOT_BEFORE_CLOSE_MINUTES = 30;

export function isClinicOpenOn(date: Date): boolean {
  return CLINIC_HOURS_BY_DAY[date.getDay()] != null;
}

export function getHoursForDate(date: Date): DayHours | null {
  return CLINIC_HOURS_BY_DAY[date.getDay()] ?? null;
}

function toMinutes(t: TimeOfDay): number {
  return t.hour * 60 + t.minute;
}

function formatSlotLabel(totalMinutes: number): string {
  const hour24 = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
}

/**
 * Bookable time slots for a given calendar day, based on operating hours.
 * Returns [] when the clinic is closed (e.g. Sunday).
 */
export function getTimeSlotsForDate(date: Date): string[] {
  const hours = getHoursForDate(date);
  if (!hours) return [];

  const start = toMinutes(hours.open);
  const end = toMinutes(hours.close) - LAST_SLOT_BEFORE_CLOSE_MINUTES;

  if (end < start) return [];

  const slots: string[] = [];
  for (let m = start; m <= end; m += SLOT_INTERVAL_MINUTES) {
    slots.push(formatSlotLabel(m));
  }
  return slots;
}

/** Matcher for react-day-picker: disable closed weekdays (Sunday). */
export const CLINIC_CLOSED_DAYS_OF_WEEK = [0] as const;
