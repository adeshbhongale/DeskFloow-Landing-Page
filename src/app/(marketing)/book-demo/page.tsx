import { PageHero } from "@/components/layout/page-hero";
import { LeadForm } from "@/components/marketing/lead-form";
import { ButtonLink } from "@/components/ui/button";
import { Check, Clock, Layers, PhoneCall, ShieldCheck, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Book a Personalized DeskFloow Demo",
  description:
    "Schedule a 1-on-1 walkthrough tailored to your hotel, resort, homestay or property group. See reservations, tape charts, 2-way OTA sync, automated WhatsApp booking & check-in alerts, and housekeeping.",
  alternates: { canonical: "/book-demo" },
};

const expect = [
  {
    title: "Visual Front Desk & 7-Day Tape Chart",
    text: "Drag-and-drop reservations, room readiness guards, and live arrival/departure tracking.",
  },
  {
    title: "Automated WhatsApp Booking, Check-In & Out Alerts",
    text: "See how guests receive instant booking confirmations, room check-in messages, and check-out invoices.",
  },
  {
    title: "Real-Time 2-Way OTA Channel Sync",
    text: "Live inventory and rate parity across Booking.com, MakeMyTrip, Goibibo, Agoda, and Airbnb.",
  },
  {
    title: "Visual Floor Plan, Housekeeping & Guest Directory",
    text: "Track clean/dirty room turnaround, add guest profiles, and send service updates in one click.",
  },
  {
    title: "GST Folios, Room Service POS & Shift Handover",
    text: "Automated room charges, itemized GST invoices, and cashier drawer balancing at shift close.",
  },
];

export default function BookDemoPage() {
  return (
    <div className="bg-gradient-to-b from-brand-50/50 via-white to-brand-50/35">
      <PageHero
        crumbs={[{ label: "Book a demo" }]}
        eyebrow="Personalized Walkthrough"
        title="See DeskFloow configured for your hotel."
        lead="Share your property details and our hospitality engineering specialists will prepare a live 1-on-1 walkthrough tailored to how your rooms, front desk, and channels operate."
      />

      <section className="container-x grid items-start gap-8 pb-24 lg:grid-cols-[1fr_1.28fr] lg:gap-10">
        {/* Left Column: Visual Hero Card + What You Will Experience */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-[28px] border border-brand-200/80 bg-gradient-to-br from-brand-100/70 via-white to-gold-100/40 p-2.5 shadow-lift">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[22px]">
              <Image
                src="/images/frontdesk-tablet-reception.jpg"
                alt="Luxury hotel front desk staff with modern tablet"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/30 to-transparent" />

              <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-brand-950/80 px-3 py-1 text-[11.5px] font-semibold text-white backdrop-blur-md">
                  <Sparkles className="size-3.5 text-gold-300" />
                  1-on-1 Hospitality Consultation
                </span>
                <span className="rounded-full border border-gold-300/40 bg-gold-400/20 px-2.5 py-0.5 text-[11px] font-semibold text-gold-200 backdrop-blur-md">
                  25–30 Min Live Session
                </span>
              </div>

              <div className="absolute inset-x-3.5 bottom-3.5 rounded-2xl border border-white/15 bg-brand-950/85 p-4 text-white backdrop-blur-md">
                <p className="text-[14px] font-bold text-gold-300">
                  Tailored to Your Rooms, Rates &amp; Channels
                </p>
                <p className="mt-1 text-[12.5px] leading-snug text-white/85">
                  Have a quick question before scheduling? Reach our hospitality desk directly for immediate assistance.
                </p>
                <ButtonLink href="/contact" size="sm" variant="gold" className="mt-3">
                  <PhoneCall className="size-3.5" /> Contact Directly
                </ButtonLink>
              </div>
            </div>
          </div>

          <div className="rounded-[26px] border border-brand-200/80 bg-gradient-to-b from-white via-white to-brand-50/45 p-5 shadow-card sm:p-6">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100/90 px-3 py-1 text-[11px] font-semibold text-brand-700">
                <Layers className="size-3.5 text-brand-600" /> Full Platform Walkthrough
              </span>
              <span className="flex items-center gap-1 text-[11.5px] font-medium text-muted-foreground">
                <Clock className="size-3.5 text-brand-600" /> Live Screen Share
              </span>
            </div>

            <h2 className="mt-3 text-[19px] font-bold tracking-tight text-ink">
              What you will experience in your demo
            </h2>

            <ul className="mt-4 space-y-3">
              {expect.map((item) => (
                <li
                  key={item.title}
                  className="flex items-start gap-3 rounded-xl border border-brand-100/90 bg-white/90 p-3 shadow-2xs"
                >
                  <span className="mt-0.5 grid size-5.5 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-2xs">
                    <Check className="size-3.5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-[13.5px] font-bold text-ink">{item.title}</p>
                    <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted-foreground">
                      {item.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Demo Form + Zero Commitment Guarantee Box */}
        <div className="space-y-6">
          <LeadForm mode="demo" />

          <div className="rounded-[24px] border border-gold-400/35 bg-gradient-to-r from-brand-950 via-brand-800 to-brand-900 p-6 text-white shadow-lift">
            <p className="flex items-center gap-2 text-[15px] font-bold text-gold-300">
              <ShieldCheck className="size-5 shrink-0 text-gold-300" />
              Zero Commitment · Custom Migration Roadmap Included
            </p>
            <p className="mt-2 text-[13.5px] leading-relaxed text-white/85">
              Demos take 25–30 minutes over Google Meet or Zoom. We walk through real hospitality scenarios matching your property size and provide a transparent commercial proposal.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
