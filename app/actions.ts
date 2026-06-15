"use server";

import { Resend } from "resend";
import { bookingSchema } from "@/lib/booking-schema";
import { format } from "date-fns";

interface BookingResult {
  success: boolean;
  message?: string;
}

export async function bookAppointment(
  formData: unknown
): Promise<BookingResult> {
  // Validate
  const parsed = bookingSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please check the form for errors and try again.",
    };
  }

  const data = parsed.data;
  const formattedDate = format(data.preferredDate, "EEEE, MMMM dd, yyyy");

  const clinicEmail = "hello@zenpulseclinic.my";
  const subject = `New Appointment Request - ${data.fullName}`;

  // Use Resend's test domain unless you have verified your own domain
  const fromAddress = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1E2937;">
      <h1 style="color: #3a2f2a; border-bottom: 2px solid #e5d5bf; padding-bottom: 12px;">New Appointment Request</h1>
      
      <h2 style="margin-top: 24px; color: #e5d5bf;">Patient Details</h2>
      <p><strong>Name:</strong> ${data.fullName}</p>
      <p><strong>Phone (WhatsApp):</strong> ${data.phone}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      
      <h2 style="margin-top: 24px; color: #e5d5bf;">Appointment</h2>
      <p><strong>Service:</strong> ${data.service}</p>
      <p><strong>Preferred Date:</strong> ${formattedDate}</p>
      <p><strong>Preferred Time:</strong> ${data.preferredTime}</p>
      
      ${
        data.notes
          ? `<h2 style="margin-top: 24px; color: #e5d5bf;">Notes</h2><p style="white-space: pre-wrap;">${data.notes}</p>`
          : ""
      }

      <hr style="margin: 32px 0; border: none; border-top: 1px solid #e2e8f0;" />
      <p style="font-size: 13px; color: #64748b;">
        Submitted via Zen Pulse website booking form.<br />
        Please contact the patient to confirm the appointment.
      </p>
    </div>
  `;

  try {
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);

      // Send to clinic
      await resend.emails.send({
        from: `Zen Pulse Clinic <${fromAddress}>`,
        to: clinicEmail,
        subject,
        html,
      });

      // Optional: send nice confirmation to patient
      await resend.emails.send({
        from: `Zen Pulse Acupuncture Medical Centre <${fromAddress}>`,
        to: data.email,
        subject: "Your Appointment Request at Zen Pulse",
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1E2937;">
            <h1 style="color: #3a2f2a;">Thank you, ${data.fullName.split(" ")[0]}.</h1>
            <p>We have received your request for <strong>${data.service}</strong> on <strong>${formattedDate} at ${data.preferredTime}</strong>.</p>
            <p>Our team will contact you via WhatsApp or phone within 2 hours during clinic operating hours to confirm your slot.</p>
            <p style="margin-top: 24px;">Warm regards,<br />The Zen Pulse Team</p>
            <p style="font-size: 13px; color: #64748b; margin-top: 40px;">Zen Pulse Acupuncture Medical Centre • Subang Jaya</p>
          </div>
        `,
      });
    } else {
      // Graceful fallback for development / when no key is configured
      console.log("[BOOKING ACTION] No RESEND_API_KEY found — running in demo mode.");
      console.log("Submitted data:", { ...data, preferredDate: formattedDate });
      console.log("→ To enable real emails, create .env.local with RESEND_API_KEY=your_key");
    }

    return {
      success: true,
      message: "Your request has been received.",
    };
  } catch (error) {
    console.error("Booking email error:", error);
    // Still succeed for the patient — we have the data in logs
    return {
      success: true,
      message: "Your request has been received. We will contact you shortly.",
    };
  }
}
