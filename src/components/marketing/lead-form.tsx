"use client";

import { SuccessCelebration } from "@/components/animations/success-celebration";
import { Button } from "@/components/ui/button";
import { contactMethods, leadSchema, propertyTypes, type LeadInput, type LeadValues } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const RECIPIENTS = ["adeshbhongale007@gmail.com", "prasannagaikwad0018@gmail.com"] as const;

async function submitLead(values: LeadValues, mode: "demo" | "contact") {
  const res = await fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...values, mode }),
  });

  const data = (await res.json().catch(() => null)) as { ok?: boolean; method?: string } | null;

  // If SMTP_PASS isn't set yet in .env.local, also trigger browser-side AJAX delivery (zero redirect)
  if (!data || data.method === "direct-relay") {
    const subject =
      mode === "demo"
        ? `[DeskFloow Demo Request] ${values.property} — ${values.name}`
        : `[DeskFloow Contact Inquiry] ${values.name}`;

    const payload: Record<string, string> = {
      _subject: subject,
      _cc: RECIPIENTS.slice(1).join(","),
      _template: "table",
      _captcha: "false",
      "Submission Type": mode === "demo" ? "Personalized Demo Request" : "Contact Inquiry",
      "Full Name": values.name,
      "Email Address": values.email,
      "Phone Number": values.phone,
      "Preferred Contact": values.contactMethod,
      ...(mode === "demo"
        ? {
          "Hotel / Property": values.property,
          "Property Type": values.propertyType,
          "Total Rooms": String(values.rooms),
          "Total Properties": String(values.properties),
        }
        : {}),
      Message: values.message?.trim() || "No additional message provided.",
    };

    await fetch(`https://formsubmit.co/ajax/${RECIPIENTS[0]}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    }).catch(() => null);
  }
}

export function LeadForm({ mode = "demo", defaultPlan }: { mode?: "demo" | "contact"; defaultPlan?: string }) {
  const isContact = mode === "contact";
  const [done, setDone] = useState<LeadValues | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadInput, unknown, LeadValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      property: isContact ? "General Contact" : "",
      propertyType: isContact ? "Independent hotel" : undefined,
      rooms: isContact ? "1" : "",
      properties: "1",
      contactMethod: "Email",
      message: defaultPlan ? `Interested in the ${defaultPlan} plan.` : "",
    },
  });

  if (done) {
    return (
      <div className="overflow-hidden rounded-[28px] border border-brand-200/90 bg-gradient-to-b from-white via-brand-50/30 to-gold-100/20 p-6 sm:p-8 shadow-lift">
        <SuccessCelebration
          title={
            mode === "demo"
              ? "Your personalized demo request has been sent!"
              : "Your message has been sent to our team!"
          }
        >
          Thank you, <strong>{done.name.split(" ")[0]}</strong>.{" "}
          {mode === "demo" ? (
            <>
              Your demo request for <strong>{done.property}</strong> ({done.rooms} rooms) has been dispatched directly
              to our specialist inbox.
            </>
          ) : (
            <>
              Your inquiry has been dispatched directly to our hospitality team. We will get back to you via{" "}
              <strong>{done.contactMethod}</strong> shortly.
            </>
          )}
        </SuccessCelebration>

        <div className="mt-6 flex justify-center">
          <Button variant="secondary" size="sm" onClick={() => setDone(null)}>
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(async (v) => {
        if (isSubmitting) return;
        await submitLead(v, mode);
        setDone(v);
      })}
      className="overflow-hidden rounded-[28px] border border-brand-200/90 bg-gradient-to-b from-white via-white to-brand-50/45 shadow-lift"
      aria-label={mode === "demo" ? "Book a demo" : "Contact sales"}
    >
      {/* Top Theme-Graded Banner */}
      <div className="border-b border-brand-200/60 bg-gradient-to-r from-brand-950 via-brand-800 to-brand-700 px-6 py-5 text-white sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-300/40 bg-gold-400/20 px-3 py-1 text-[11.5px] font-semibold text-gold-200">
            <Sparkles className="size-3.5 text-gold-300" />
            {mode === "demo" ? "1-on-1 Live Product Walkthrough" : "Direct Hospitality Desk"}
          </span>
          <span className="text-[11.5px] font-medium text-brand-100">
            Fast response · Direct specialist inbox
          </span>
        </div>
        <h3 className="mt-2.5 text-[20px] font-bold tracking-tight text-white sm:text-[22px]">
          {mode === "demo"
            ? "Book Your Personalized DeskFloow Demo"
            : "Send Us a Message"}
        </h3>
        <p className="mt-1 text-[13px] text-white/80">
          {mode === "demo"
            ? "Tell us about your property and we will configure a live walkthrough around your rooms and workflows."
            : "Have a question or need assistance? Fill out the form below and our team will get back to you promptly."}
        </p>
      </div>

      <div className="space-y-5 p-6 sm:p-8">
        {isContact ? (
          /* Normal Contact Form (No property/room fields) */
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <F label="Full name" error={errors.name?.message} id="lf-name">
                <input
                  id="lf-name"
                  placeholder="e.g. Rajesh Rathore"
                  className="field border-brand-200/90 bg-white focus:border-brand-600"
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  {...register("name")}
                />
              </F>
              <F label="Email address" error={errors.email?.message} id="lf-email">
                <input
                  id="lf-email"
                  type="email"
                  placeholder="you@example.com"
                  className="field border-brand-200/90 bg-white focus:border-brand-600"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
              </F>
            </div>
            <F label="Phone / WhatsApp number" error={errors.phone?.message} id="lf-phone">
              <input
                id="lf-phone"
                type="tel"
                className="field border-brand-200/90 bg-white focus:border-brand-600"
                autoComplete="tel"
                placeholder="+91 98765 43210"
                aria-invalid={!!errors.phone}
                {...register("phone")}
              />
            </F>
          </div>
        ) : (
          /* Full Demo Form (Includes property & room fields) */
          <div className="grid gap-4 sm:grid-cols-2">
            <F label="Full name" error={errors.name?.message} id="lf-name">
              <input
                id="lf-name"
                placeholder="e.g. Rajesh Rathore"
                className="field border-brand-200/90 bg-white focus:border-brand-600"
                autoComplete="name"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
            </F>
            <F label="Work email" error={errors.email?.message} id="lf-email">
              <input
                id="lf-email"
                type="email"
                placeholder="you@yourhotel.com"
                className="field border-brand-200/90 bg-white focus:border-brand-600"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
            </F>
            <F label="Phone / WhatsApp number" error={errors.phone?.message} id="lf-phone">
              <input
                id="lf-phone"
                type="tel"
                className="field border-brand-200/90 bg-white focus:border-brand-600"
                autoComplete="tel"
                placeholder="+91 98765 43210"
                aria-invalid={!!errors.phone}
                {...register("phone")}
              />
            </F>
            <F label="Hotel / property name" error={errors.property?.message} id="lf-prop">
              <input
                id="lf-prop"
                placeholder="e.g. Grand Palace Heritage Hotel"
                className="field border-brand-200/90 bg-white focus:border-brand-600"
                autoComplete="organization"
                aria-invalid={!!errors.property}
                {...register("property")}
              />
            </F>
            <F label="Property type" error={errors.propertyType?.message} id="lf-type">
              <select
                id="lf-type"
                className="field border-brand-200/90 bg-white focus:border-brand-600"
                defaultValue=""
                aria-invalid={!!errors.propertyType}
                {...register("propertyType")}
              >
                <option value="" disabled>
                  Select property category…
                </option>
                {propertyTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </F>
            <div className="grid grid-cols-2 gap-3">
              <F label="Total rooms" error={errors.rooms?.message} id="lf-rooms">
                <input
                  id="lf-rooms"
                  type="number"
                  min={1}
                  placeholder="25"
                  inputMode="numeric"
                  className="field border-brand-200/90 bg-white focus:border-brand-600"
                  aria-invalid={!!errors.rooms}
                  {...register("rooms")}
                />
              </F>
              <F label="Properties" error={errors.properties?.message} id="lf-props">
                <input
                  id="lf-props"
                  type="number"
                  min={1}
                  inputMode="numeric"
                  className="field border-brand-200/90 bg-white focus:border-brand-600"
                  aria-invalid={!!errors.properties}
                  {...register("properties")}
                />
              </F>
            </div>
          </div>
        )}

        <fieldset>
          <legend className="label">Preferred follow-up channel</legend>
          <div className="flex flex-wrap gap-2.5">
            {contactMethods.map((c) => (
              <label
                key={c}
                className="flex cursor-pointer items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-2 text-[13.5px] font-medium text-ink transition hover:border-brand-400 has-[:checked]:border-brand-600 has-[:checked]:bg-brand-600 has-[:checked]:text-white has-[:checked]:shadow-xs"
              >
                <input type="radio" value={c} className="sr-only" {...register("contactMethod")} />
                {c}
              </label>
            ))}
          </div>
        </fieldset>

        <F
          label={
            mode === "demo"
              ? "Which workflows would you like to explore in your demo? (optional)"
              : "Your message"
          }
          error={errors.message?.message}
          id="lf-msg"
        >
          <textarea
            id="lf-msg"
            rows={isContact ? 6 : 4}
            placeholder={
              mode === "demo"
                ? "e.g. Front desk tape chart, 2-way OTA sync, automated WhatsApp booking & check-in alerts, GST billing…"
                : "Write your message or question here…"
            }
            className="field resize-none border-brand-200/90 bg-white focus:border-brand-600"
            {...register("message")}
          />
        </F>

        <div className="flex flex-col-reverse items-start justify-between gap-4 border-t border-brand-100 pt-4 sm:flex-row sm:items-center">
          <p className="flex items-center gap-2 text-[12.5px] font-medium text-muted-foreground">
            <ShieldCheck className="size-4 shrink-0 text-brand-600" />
            Direct dispatch to our hospitality specialists · Response within 1 business day.
          </p>
          <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Sending…
              </>
            ) : (
              <>
                <Send className="size-4" />{" "}
                {mode === "demo" ? "Schedule Personalized Demo" : "Send Message"}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

function F({
  label,
  error,
  id,
  children,
}: {
  label: string;
  error?: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-[12.5px] font-medium text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
