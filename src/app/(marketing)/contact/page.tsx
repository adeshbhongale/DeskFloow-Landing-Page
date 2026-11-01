import type { Metadata } from "next";
import {
  CalendarCheck,
  Clock,
  MessagesSquare,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Building2,
} from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { LeadForm } from "@/components/marketing/lead-form";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contact the DeskFloow Hospitality Team",
  description:
    "Have questions about DeskFloow PMS, 2-way OTA sync, or automated WhatsApp booking & check-in alerts for your hotel, resort, homestay or hotel group? Reach our specialists directly.",
  alternates: { canonical: "/contact" },
};

const info = [
  {
    Icon: MessagesSquare,
    badge: "Tailored Guidance",
    title: "Sales & Property Consultation",
    body: "Share your property size, room categories, and the daily workflows you want to simplify — from front desk check-ins to automated WhatsApp alerts and GST folios.",
  },
  {
    Icon: Clock,
    badge: "Priority SLA",
    title: "Fast Specialist Response",
    body: "Every inquiry goes straight to our hospitality product specialists, with a dedicated response and tailored configuration plan within 1 business day.",
  },
  {
    Icon: ShieldCheck,
    badge: "Direct Specialist Inbox",
    title: "Seamless Onboarding & Migration",
    body: "Moving from manual spreadsheets or a legacy PMS? Our engineering team handles room inventory setup, rate plans, and zero-downtime staff onboarding.",
  },
];

const highlights = [
  "Configured for independent hotels, resorts, homestays & groups",
  "Direct specialist email routing with zero ticket queues",
  "Free property setup & rate plan consultation",
];

export default function ContactPage() {
  return (
    <div className="bg-gradient-to-b from-brand-50/50 via-white to-brand-50/35">
      <PageHero
        crumbs={[{ label: "Contact" }]}
        eyebrow="Contact DeskFloow"
        title="Let's talk about your property."
        lead="Whether you manage an 8-room boutique stay or a multi-property hotel group, share your requirements and our hospitality specialists will connect with you."
      />

      <section className="container-x grid items-start gap-10 pb-24 lg:grid-cols-[1fr_1.32fr]">
        <div className="space-y-4">
          {info.map(({ Icon, badge, title, body }) => (
            <div
              key={title}
              className="group rounded-2xl border border-brand-200/80 bg-gradient-to-br from-white via-white to-brand-50/60 p-5 shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift"
            >
              <div className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-700 to-brand-500 text-white shadow-sm">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <span className="inline-block rounded-full bg-brand-100/90 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700">
                    {badge}
                  </span>
                  <h2 className="mt-1 text-[16px] font-bold tracking-tight text-ink">
                    {title}
                  </h2>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Royal Purple & Gold Walkthrough Card */}
          <div className="relative overflow-hidden rounded-[26px] border border-gold-400/35 bg-gradient-to-br from-brand-950 via-brand-800 to-brand-700 p-6 text-white shadow-lift">
            <div
              className="pointer-events-none absolute -top-12 -right-12 size-40 rounded-full bg-gold-400/15 blur-2xl"
              aria-hidden
            />
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-300/40 bg-gold-400/20 px-3 py-1 text-[11.5px] font-semibold text-gold-200">
                <Sparkles className="size-3.5 text-gold-300" /> Guided Live Walkthrough
              </span>
              <Building2 className="size-5 text-gold-300" aria-hidden />
            </div>

            <h2 className="mt-3.5 text-[19px] font-bold tracking-tight text-white">
              Prefer a live 1-on-1 product walkthrough?
            </h2>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/80">
              See DeskFloow configured with your exact room categories, tariff plans, OTA channels, and automated guest WhatsApp alerts.
            </p>

            <ul className="mt-4 space-y-2 border-t border-white/15 pt-3.5 text-[12.5px] text-white/90">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-gold-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <ButtonLink href="/book-demo" variant="gold" size="sm" className="mt-5">
              <CalendarCheck className="size-4" /> Book a Personalized Demo
            </ButtonLink>
          </div>
        </div>

        <LeadForm mode="contact" />
      </section>
    </div>
  );
}
