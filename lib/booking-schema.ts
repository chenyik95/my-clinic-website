import { z } from "zod";

// Services list for validation (keep in sync with messages/en.json)
export const SERVICE_OPTIONS = [
  "Acupuncture",
  "Tuina Therapeutic Massage",
  "Herbal Medicine Consultation",
  "Cupping Therapy",
  "Moxibustion",
  "Facial Rejuvenation Acupuncture",
] as const;

export const bookingSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  phone: z
    .string()
    .min(8, "Please enter a valid phone number")
    .regex(
      /^(\+?6?0?1?\d{7,10}|\+?6?0?3?\d{7,8})$/,
      "Please enter a valid Malaysian phone number"
    ),
  // Optional — booking is completed via WhatsApp
  email: z
    .string()
    .trim()
    .refine((val) => val === "" || z.string().email().safeParse(val).success, {
      message: "Please enter a valid email address",
    }),
  service: z.enum(SERVICE_OPTIONS, {
    required_error: "Please select a service",
  }),
  preferredDate: z.date({
    required_error: "Please select a preferred date",
    invalid_type_error: "Please select a valid date",
  }),
  preferredTime: z.string().min(1, "Please select a preferred time"),
  notes: z.string().max(500, "Notes must be under 500 characters").optional(),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
