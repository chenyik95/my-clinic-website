import { format } from "date-fns";
import { CLINIC } from "@/lib/clinic";
import type { BookingFormValues } from "@/lib/booking-schema";

export function buildBookingWhatsAppMessage(data: BookingFormValues): string {
  const formattedDate = format(data.preferredDate, "EEEE, MMMM dd, yyyy");

  const lines = [
    `Hello ${CLINIC.name},`,
    "",
    "I would like to book an appointment:",
    "",
    `*Name:* ${data.fullName}`,
    `*Phone:* ${data.phone}`,
    `*Email:* ${data.email}`,
    `*Service:* ${data.service}`,
    `*Preferred Date:* ${formattedDate}`,
    `*Preferred Time:* ${data.preferredTime}`,
  ];

  if (data.notes?.trim()) {
    lines.push(`*Notes:* ${data.notes.trim()}`);
  }

  return lines.join("\n");
}

export function buildBookingWhatsAppUrl(data: BookingFormValues): string {
  const message = buildBookingWhatsAppMessage(data);
  return `https://wa.me/${CLINIC.whatsapp}?text=${encodeURIComponent(message)}`;
}