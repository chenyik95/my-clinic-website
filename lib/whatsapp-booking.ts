import { format, startOfDay } from "date-fns";
import { CLINIC } from "@/lib/clinic";
import type { BookingFormValues } from "@/lib/booking-schema";

export function buildBookingWhatsAppMessage(data: BookingFormValues): string {
  // Normalize so formatting always uses the local calendar day
  const formattedDate = format(
    startOfDay(data.preferredDate),
    "EEEE, MMMM dd, yyyy"
  );

  const lines = [
    `Hello ${CLINIC.name},`,
    "",
    "I would like to book an appointment:",
    "",
    `*Name:* ${data.fullName}`,
    `*Phone:* ${data.phone}`,
  ];

  if (data.email?.trim()) {
    lines.push(`*Email:* ${data.email.trim()}`);
  }

  lines.push(
    `*Service:* ${data.service}`,
    `*Preferred Date:* ${formattedDate}`,
    `*Preferred Time:* ${data.preferredTime}`
  );

  if (data.notes?.trim()) {
    lines.push(`*Notes:* ${data.notes.trim()}`);
  }

  return lines.join("\n");
}

export function buildBookingWhatsAppUrl(data: BookingFormValues): string {
  const message = buildBookingWhatsAppMessage(data);
  return `https://wa.me/${CLINIC.whatsapp}?text=${encodeURIComponent(message)}`;
}
