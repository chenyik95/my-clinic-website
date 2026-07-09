"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  bookingSchema,
  type BookingFormValues,
  SERVICE_OPTIONS,
} from "@/lib/booking-schema";
import {
  CLINIC_CLOSED_DAYS_OF_WEEK,
  getTimeSlotsForDate,
} from "@/lib/clinic-hours";
import { buildBookingWhatsAppUrl } from "@/lib/whatsapp-booking";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function FieldOptional({ children }: { children: React.ReactNode }) {
  return (
    <span className="ml-1.5 text-xs font-normal text-text-secondary/70">
      {children}
    </span>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mocha">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function BookingDialog({ open, onOpenChange }: BookingDialogProps) {
  const t = useTranslations("booking");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      service: undefined,
      preferredTime: "",
      notes: "",
    },
  });

  const services = [...SERVICE_OPTIONS];
  const preferredDate = form.watch("preferredDate");
  const preferredTime = form.watch("preferredTime");

  // Time slots follow the selected day's operating hours
  const timeOptions = useMemo(
    () => (preferredDate ? getTimeSlotsForDate(preferredDate) : []),
    [preferredDate]
  );

  // If date changes and current time is no longer valid, clear it
  useEffect(() => {
    if (!preferredTime) return;
    if (timeOptions.length === 0 || !timeOptions.includes(preferredTime)) {
      form.setValue("preferredTime", "");
    }
  }, [preferredDate, preferredTime, timeOptions, form]);

  // Past days + Sundays (clinic closed)
  const disabledDays = [
    { before: startOfDay(new Date()) },
    { dayOfWeek: [...CLINIC_CLOSED_DAYS_OF_WEEK] },
  ];

  const timePlaceholder = !preferredDate
    ? t("form.selectDateFirst")
    : timeOptions.length === 0
      ? t("form.closedDay")
      : t("form.selectTime");

  const hoursHint =
    preferredDate && timeOptions.length > 0
      ? preferredDate.getDay() === 6
        ? t("hoursHint.saturday")
        : t("hoursHint.weekday")
      : null;

  function onSubmit(values: BookingFormValues) {
    setIsSubmitting(true);

    const whatsappUrl = buildBookingWhatsAppUrl(values);
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    setIsSubmitting(false);
    toast.success(t("successTitle"), {
      description: t("successMessage"),
      duration: 6000,
    });
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(92vh,720px)] w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-3xl border-mocha-muted p-0 sm:max-w-[440px]">
        {/* Header */}
        <div className="shrink-0 border-b border-mocha-muted/60 px-6 pb-4 pt-6 pr-12">
          <DialogHeader className="space-y-1.5 text-left">
            <DialogTitle className="font-serif text-xl tracking-tight text-secondary sm:text-2xl">
              {t("title")}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-text-secondary">
              {t("subtitle")}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable form body */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5">
              {/* 1. Contact details */}
              <FormSection title={t("sections.contact")}>
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.fullName")}</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="name"
                          placeholder={t("placeholders.fullName")}
                          className="h-11 rounded-xl bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.phone")}</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder={t("placeholders.phone")}
                          className="h-11 rounded-xl bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("form.email")}
                        <FieldOptional>{t("form.optional")}</FieldOptional>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          autoComplete="email"
                          placeholder={t("placeholders.email")}
                          className="h-11 rounded-xl bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormSection>

              {/* 2. Appointment */}
              <FormSection title={t("sections.appointment")}>
                <FormField
                  control={form.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.service")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 rounded-xl bg-white">
                            <SelectValue placeholder={t("selectService")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service} value={service}>
                              {service}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferredDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t("form.preferredDate")}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              className={cn(
                                "h-11 w-full justify-start rounded-xl bg-white pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "EEE, d MMM yyyy")
                              ) : (
                                <span>{t("form.pickDate")}</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-white" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) =>
                              field.onChange(date ? startOfDay(date) : undefined)
                            }
                            disabled={disabledDays}
                            // Malaysia / most of Asia: week starts Monday
                            weekStartsOn={1}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferredTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.preferredTime")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                        disabled={!preferredDate || timeOptions.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 rounded-xl bg-white">
                            <SelectValue placeholder={timePlaceholder} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {hoursHint ? (
                        <p className="text-xs text-text-secondary/80">
                          {hoursHint}
                        </p>
                      ) : null}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormSection>

              {/* 3. Notes */}
              <FormSection title={t("sections.notes")}>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("form.notes")}
                        <FieldOptional>{t("form.optional")}</FieldOptional>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("placeholders.notes")}
                          className="min-h-[72px] resize-none rounded-xl bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormSection>
            </div>

            {/* Sticky footer CTA */}
            <div className="shrink-0 border-t border-mocha-muted/60 bg-mocha-light/50 px-6 py-4">
              <Button
                type="submit"
                className="h-12 w-full rounded-2xl text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? t("form.submitting") : t("form.submit")}
              </Button>
              <p className="mt-2.5 text-center text-xs leading-relaxed text-text-secondary">
                {t("privacyNote")}
              </p>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
