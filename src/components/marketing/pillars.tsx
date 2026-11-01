"use client";

import Image from "next/image";
import { type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, CalendarCheck, Check, ShieldCheck, Sparkles } from "lucide-react";
import { FrontDeskDashboard } from "@/components/dashboard/front-desk";
import { TapeChart } from "@/components/dashboard/tape-chart";
import { FloorPlan } from "@/components/dashboard/floor-plan";
import { GuestCrm } from "@/components/dashboard/guest-crm";
import { FolioView, ShiftRegister } from "@/components/dashboard/folio";
import { PropertySwitcher } from "@/components/dashboard/multi-property";
import { WhatsAppInbox } from "@/components/messaging/whatsapp-inbox";
import { OrderBoard } from "@/components/orders/order-board";
import { OtaSync } from "./ota-sync";
import { ProductTour } from "./product-tour";
import { SectionHeading } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const smoothEase = [0.22, 1, 0.36, 1] as const;

export function Pillar({
  id,
  eyebrow,
  title,
  lead,
  children,
  className,
  aside,
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  lead: ReactNode;
  children: ReactNode;
  className?: string;
  aside?: ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.section
      id={id}
      initial={reduce ? false : { opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7, ease: smoothEase }}
      className={cn("scroll-mt-20 overflow-hidden py-14 sm:py-28", className)}
    >
      <div className="container-x">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: smoothEase }}
          className="flex flex-wrap items-end justify-between gap-4 sm:gap-6"
        >
          <SectionHeading eyebrow={eyebrow} title={title} lead={lead} className="min-w-0" />
          {aside ?? (
            <motion.span
              whileHover={{ scale: 1.04, y: -2 }}
              transition={{ type: "spring", stiffness: 320, damping: 20 }}
              className="chip bg-brand-100/90 text-brand-700 font-semibold px-3 py-1 shadow-2xs"
            >
              <Sparkles className="size-3 text-gold-500" /> Interactive Product Preview
            </motion.span>
          )}
        </motion.div>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 32, scale: 0.985 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.75, delay: 0.1, ease: smoothEase }}
          className="mt-8 sm:mt-10 min-w-0 max-w-full"
        >
          {children}
        </motion.div>
      </div>
    </motion.section>
  );
}

export function FrontDeskPillar() {
  return (
    <Pillar
      id="front-desk"
      eyebrow="Front desk PMS & analytics"
      title="Your entire front desk. One clear picture."
      lead="Know what's happening across arrivals, departures, occupancy, cash, and room readiness without switching between disconnected tools."
    >
      <div id="analytics" className="scroll-mt-24 overflow-hidden rounded-[22px] sm:rounded-[28px] border border-line bg-brand-50/50 p-2.5 sm:p-5">
        <FrontDeskDashboard />
      </div>
    </Pillar>
  );
}

export function TapeChartPillar() {
  return (
    <Pillar
      id="tape-chart"
      eyebrow="Visual 7-day tape chart"
      title="See every room. Every reservation. Every day."
      lead="Drag a booking to another room or date, click an empty cell to create one, or open any reservation to reassign it with the keyboard. Overlaps are blocked and nothing is overwritten."
      className="bg-white"
    >
      <TapeChart />
    </Pillar>
  );
}

export function ChannelsPillar() {
  const reduce = useReducedMotion();

  return (
    <motion.section
      id="channels"
      initial={reduce ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7, ease: smoothEase }}
      className="relative scroll-mt-20 overflow-hidden bg-brand-950 py-24 text-white sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgb(153_85_255/0.35),transparent_55%),radial-gradient(ellipse_at_90%_100%,rgb(251_191_36/0.15),transparent_50%)]" />
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="container-x relative">
        <SectionHeading
          tone="inverted"
          eyebrow="OTA channel manager"
          title={<>Every booking channel. <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-amber-300 bg-clip-text text-transparent">One source of truth.</span></>}
          lead="Bring your direct reservations and connected online travel agencies into a unified inventory workflow designed to eliminate manual updates and prevent costly double bookings."
        />
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.75, delay: 0.1, ease: smoothEase }}
          className="mt-14"
        >
          <OtaSync />
        </motion.div>
        <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Channel adapters", "Dedicated 2-way connectors for Booking.com, Airbnb, Expedia, Agoda, MakeMyTrip and Goibibo."],
            ["Idempotent ingestion", "Webhooks and rate pushes are atomic and de-duplicated to guarantee zero ghost bookings."],
            ["Instant rate & stop-sell", "Change rates or close dates once in DeskFloow; updates push to all channels in under 1 second."],
            ["Audit & reconciliation", "Every sync event is recorded in a tamper-proof log with instant error notifications."],
          ].map(([t, d], i) => (
            <motion.div
              key={t}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: smoothEase }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-colors hover:bg-white/[0.07]"
            >
              <p className="text-[14px] font-semibold text-white">{t}</p>
              <p className="mt-1.5 text-[13px] text-white/60 leading-relaxed">{d}</p>
            </motion.div>
          ))}
        </div>
        <p className="mt-5 text-[12.5px] text-white/50 flex items-center gap-1.5">
          <ShieldCheck className="size-4 text-emerald-400" /> High-concurrency 2-way synchronization architecture with 99.9% uptime SLA.
        </p>
      </div>
    </motion.section>
  );
}

export function WhatsAppPillar() {
  return (
    <Pillar
      id="whatsapp"
      eyebrow="WhatsApp booking confirmation campaign service"
      title="Automated hotel booking confirmations on WhatsApp."
      lead="Watch DeskFloow automatically compose and send a verified WhatsApp booking confirmation message to the guest the instant a hotel reservation is confirmed — complete with booking ID, stay dates, room assignment, and live read receipts."
    >
      <WhatsAppInbox />
    </Pillar>
  );
}

export function TourPillar() {
  return (
    <Pillar
      id="tour"
      eyebrow="Guided product tour"
      title="Watch a front-desk task, start to finish."
      lead="Follow the guided workflow — or interact with each step to experience how quickly staff complete check-in and room assignments."
      className="bg-gradient-to-b from-white to-brand-50/60"
      aside={<span />}
    >
      <ProductTour />
    </Pillar>
  );
}

export function OrdersPillar() {
  return (
    <Pillar
      id="orders"
      eyebrow="Restaurant & room service"
      title="Turn every guest request into a trackable order."
      lead="Orders from guest QR menus, room-service calls, restaurant POS or front desk land on one unified board — automatically billed to the guest's folio."
      aside={
        <div className="relative hidden h-28 w-44 overflow-hidden rounded-2xl shadow-lift md:block">
          <Image src="/images/room-service.jpg" alt="Room-service breakfast tray on a hotel bed" fill sizes="176px" className="object-cover" />
        </div>
      }
    >
      <OrderBoard />
      <p className="mt-3 text-[12px] text-muted-foreground">Integrated POS order routing automatically posts charges to the room master folio.</p>
    </Pillar>
  );
}

export function HousekeepingPillar() {
  return (
    <Pillar
      id="housekeeping"
      eyebrow="Visual floor plan & housekeeping"
      title="Know the status of every room at a single glance."
      lead="Watch or interact with our guided drag-and-drop floor plan builder & housekeeping workflow — create rooms on the grid, drag guests and attendants into place, and sync room readiness across the front desk."
      className="bg-white"
    >
      <FloorPlan />
    </Pillar>
  );
}

export function CrmPillar() {
  return (
    <Pillar
      id="crm"
      eyebrow="Guest CRM & profile directory"
      title="Recognise the guest behind every reservation."
      lead="Add new guests in seconds, view every guest's complete profile, verified ID, room assignment, and stay history, and send instant service messages directly to their phone."
    >
      <GuestCrm />
    </Pillar>
  );
}

export function BookingPillar() {
  const reduce = useReducedMotion();

  return (
    <motion.section
      id="booking"
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.7, ease: smoothEase }}
      className="scroll-mt-20 py-20 sm:py-28 bg-brand-50/40"
    >
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        <SectionHeading
          eyebrow="Direct booking engine"
          title="Make direct bookings feel effortless."
          lead="A modern, high-converting, mobile-first booking engine hosted on your custom domain. Give guests transparent rates, instant room photos, add-on packages, and zero third-party commission fees."
        >
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/book-demo">
              <CalendarCheck className="size-4" /> Book a Booking Engine Walkthrough
            </ButtonLink>
            <ButtonLink href="/pricing" variant="secondary">
              View Commission-Free Plans <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
          <div className="mt-5 space-y-2 text-[13px] text-muted-foreground">
            <p className="flex items-center gap-2">
              <Check className="size-4 text-success" /> 0% commissions on all direct bookings
            </p>
            <p className="flex items-center gap-2">
              <Check className="size-4 text-success" /> Supports instant UPI, Credit/Debit cards &amp; Net Banking
            </p>
            <p className="flex items-center gap-2">
              <Check className="size-4 text-success" /> Embeds seamlessly onto your existing hotel website
            </p>
          </div>
        </SectionHeading>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96, y: 24 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, ease: smoothEase }}
          className="relative"
        >
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-[32px] shadow-lift">
            <Image
              src="/images/boutique-room.jpg"
              alt="Boutique hotel room with city view"
              fill
              sizes="420px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-transparent" />
            <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/95 p-5 backdrop-blur shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[15px] font-bold text-ink">Royal Heritage Suite</p>
                  <p className="text-[12px] text-muted-foreground">Direct Exclusive Rate · Free Breakfast</p>
                </div>
                <p className="text-[17px] font-bold text-brand-700">₹14,500</p>
              </div>
              <div className="mt-4 flex gap-1">
                {["Select Room", "Guest Details", "Instant Confirmation"].map((s, i) => (
                  <span
                    key={s}
                    className={cn(
                      "h-1.5 flex-1 rounded-full",
                      i < 2 ? "bg-brand-600" : "bg-brand-100"
                    )}
                  />
                ))}
              </div>
              <p className="mt-3 text-center text-[11px] font-semibold text-emerald-600">
                ✓ Guaranteed Lowest Rate · Free Cancellation
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export function FoliosPillar() {
  return (
    <Pillar
      id="folios"
      eyebrow="Folios, invoices & shift register"
      title="Every charge on the folio. Every rupee in the drawer."
      lead="Room nights, taxes, dining, laundry and spa charges automatically roll into itemized guest folios. The shift register calculates expected cash, card, and UPI balances at handover with clear variance tracking."
      className="bg-white"
    >
      <div className="grid min-w-0 gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="card min-w-0 overflow-hidden p-4 sm:p-5"><FolioView reservationId="RSV-1039" /></div>
        <ShiftRegister />
      </div>
    </Pillar>
  );
}

export function MultiPropertyPillar() {
  return (
    <Pillar
      id="multi-property"
      eyebrow="Multi-property portfolio"
      title="One account. Every property in view."
      lead="Manage single boutique hotels or multi-property regional groups from one master workspace with centralized occupancy, ADR, and live revenue analytics."
    >
      <PropertySwitcher />
    </Pillar>
  );
}

/** The product showcase of the homepage */
export function HomePillars() {
  return (
    <>
      <MultiPropertyPillar />
      <FrontDeskPillar />
      <TapeChartPillar />
      <ChannelsPillar />
      <WhatsAppPillar />
      <TourPillar />
      <OrdersPillar />
      <HousekeepingPillar />
      <CrmPillar />
      <BookingPillar />
      <FoliosPillar />
    </>
  );
}

export function FeaturePillars() {
  return (
    <>
      <FrontDeskPillar />
      <TapeChartPillar />
      <ChannelsPillar />
      <BookingPillar />
      <WhatsAppPillar />
      <CrmPillar />
      <HousekeepingPillar />
      <OrdersPillar />
      <FoliosPillar />
      <MultiPropertyPillar />
      <TourPillar />
    </>
  );
}
