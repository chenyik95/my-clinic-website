"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
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
import { bookingSchema, type BookingFormValues, SERVICE_OPTIONS } from "@/lib/booking-schema";
import { buildBookingWhatsAppUrl } from "@/lib/whatsapp-booking";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

  // Disable past dates
  const disabledDays = { before: new Date() };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] rounded-3xl p-0 gap-0">
        <div className="p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl tracking-tight text-secondary">
              {t("title")}
            </DialogTitle>
            <DialogDescription className="text-base text-text-secondary">
              {t("subtitle")}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.fullName")}</FormLabel>
                      <FormControl>
                        <Input placeholder="Siti Aminah" {...field} />
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
                        <Input placeholder="+60 12-345 6789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.email")}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.service")}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
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
                              variant="outline"
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={disabledDays}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="preferredTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.preferredTime")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(t.raw("timeOptions") as string[]).map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
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
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.notes")} (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any specific concerns, preferred practitioner gender, or other details..."
                        className="min-h-[100px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-3">
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base rounded-2xl bg-primary hover:bg-primary-dark"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t("form.submitting") : t("form.submit")}
                </Button>
                <p className="text-center text-xs text-text-secondary mt-3">
                  {t("privacyNote")}
                </p>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}