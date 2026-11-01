"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import {
  BarChart3,
  BedDouble,
  CalendarRange,
  CheckCircle2,
  Crown,
  Globe2,
  HeartHandshake,
  Layers,
  MessageCircle,
  Network,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UsersRound,
  UtensilsCrossed,
} from "lucide-react";
import { SectionHeading, Reveal } from "@/components/ui/reveal";
import { CountUp } from "@/components/animations/count-up";
import { cn } from "@/lib/utils";

const liveFeed = [
  {
    id: "sync",
    icon: Network,
    title: "OTA Channel Inventory Updated",
    meta: "Booking.com & Agoda · Deluxe Room 204 synced",
    badge: "2-Way Sync",
    tone: "brand",
  },
  {
    id: "whatsapp",
    icon: MessageCircle,
    title: "WhatsApp Confirmation Dispatched",
    meta: "RSV-1048 · Meera Joshi · Suite 203",
    badge: "200 OK",
    tone: "emerald",
  },
  {
    id: "hk",
    icon: Sparkles,
    title: "Housekeeping Marked Room Clean",
    meta: "Room 201 inspected · unlocked for check-in",
    badge: "Ready",
    tone: "gold",
  },
  {
    id: "folio",
    icon: UtensilsCrossed,
    title: "Room-Service Order Linked to Folio",
    meta: "ORD-501 · Posted to Room 104 master bill",
    badge: "Auto-Billed",
    tone: "brand",
  },
] as const;

const capabilities = [
  {
    icon: BedDouble,
    label: "Front Desk PMS & Shift Audit",
    stat: "Zero-Friction Check-In",
    desc: "Arrivals, departures, room assignments, split folios, and cash drawer handovers on one screen.",
  },
  {
    icon: CalendarRange,
    label: "Visual 7-Day Tape Chart",
    stat: "Drag & Drop Matrix",
    desc: "Interactive room calendar with instant overlap validation and dirty-room check-in guards.",
  },
  {
    icon: Globe2,
    label: "OTA & Direct Booking Engine",
    stat: "Unified Inventory",
    desc: "Centralize reservations from connected OTA channels alongside commission-free direct website bookings.",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp Booking Confirmations",
    stat: "Automated Campaigns",
    desc: "Trigger instant booking confirmation messages with stay dates, room details, and delivery tracking.",
  },
  {
    icon: Sparkles,
    label: "Smart Housekeeping Floor Plans",
    stat: "Live Room Readiness",
    desc: "Track Clean, Cleaning, Dirty, and Out-of-Order rooms in real time across every floor and wing.",
  },
  {
    icon: UsersRound,
    label: "Guest CRM, Orders & Analytics",
    stat: "360° Guest Profiles",
    desc: "Preferences, repeat stay history, room-service order boards, and daily occupancy & ADR dashboards.",
  },
];

const pillars = [
  {
    icon: Layers,
    title: "One Connected Record",
    tag: "Unified Architecture",
    description:
      "Instead of juggling disconnected extranets, spreadsheets, and chat groups, every reservation, room status, folio, and guest note lives in one unified workspace.",
  },
  {
    icon: Sparkles,
    title: "Front-Line Simplicity",
    tag: "Zero Clutter UI",
    description:
      "Designed so receptionists, night auditors, and housekeeping attendants can master daily workflows in minutes without complex enterprise training.",
  },
  {
    icon: HeartHandshake,
    title: "Hospitality-First Engineering",
    tag: "Built for Hotels",
    description:
      "Built around real hotel operations—dirty-room check-in guards, split folios, shift handovers, and instant WhatsApp booking confirmations.",
  },
  {
    icon: ShieldCheck,
    title: "Multi-Property Ready",
    tag: "Portfolio Control",
    description:
      "Switch between boutique inns, resorts, or city hotels from a single account with role-based permissions and audit traceability.",
  },
];

const staggerGrid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export function AboutShowcase() {
  const [feedIdx, setFeedIdx] = useState(0);
  const [activeCap, setActiveCap] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      if (!document.hidden) {
        setFeedIdx((prev) => (prev + 1) % liveFeed.length);
      }
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const currentFeed = liveFeed[feedIdx];
  const FeedIcon = currentFeed.icon;

  return (
    <>
      {/* Mission + Animated Live Operations Showcase */}
      <section className="py-20 sm:py-28">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="eyebrow">
              <span className="size-1.5 rounded-full bg-gold-400" aria-hidden />
              Our Mission
            </span>
            <h2 className="h-section mt-4 text-ink">
              Modern cloud operations for independent hotels and growing groups.
            </h2>
            <p className="lead mt-4">
              Across hospitality, front-desk teams are often forced to choose between outdated legacy systems and a
              patchwork of separate apps for reservations, channel syncing, housekeeping, and guest messaging.
            </p>
            <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">
              DeskFloow brings all of those moving parts onto a single operational canvas. When a booking arrives,
              inventory adjusts, confirmation workflows trigger, housekeeping priorities update, and the front desk sees
              it immediately.
            </p>

            {/* Animated Metric Boxes */}
            <div className="mt-8 grid grid-cols-2 gap-3.5 sm:grid-cols-3">
              {[
                { val: 9, suffix: "+", label: "Connected PMS Modules", icon: Layers },
                { val: 3, suffix: " Properties", label: "Multi-Property Demo", icon: Crown },
                { val: 100, suffix: "%", label: "Unified Guest Record", icon: BarChart3 },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border border-brand-200/80 bg-gradient-to-br from-white via-brand-50/50 to-gold-100/30 p-4 shadow-sm",
                    i === 2 && "col-span-2 sm:col-span-1",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-8 place-items-center rounded-xl bg-brand-600 text-white shadow-2xs transition-transform duration-300 group-hover:scale-110">
                      <stat.icon className="size-4" />
                    </span>
                    <span className="size-2 rounded-full bg-gold-400" />
                  </div>
                  <p className="mt-3 text-[24px] leading-none font-extrabold tracking-tight text-ink">
                    <CountUp value={stat.val} />
                    {stat.suffix}
                  </p>
                  <p className="mt-1.5 text-[12px] font-medium text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </Reveal>

          {/* Animated Visual Card with Live Floating Operations */}
          <Reveal delay={0.1}>
            <div className="relative">
              <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[34px] bg-gradient-to-tr from-brand-500/20 via-brand-300/10 to-gold-400/20 blur-2xl" />

              <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-brand-200/80 bg-brand-950 shadow-lift">
                <Image
                  src="/images/lobby.jpg"
                  alt="Warm luxury hotel reception lobby at dusk"
                  fill
                  sizes="(min-width: 1024px) 580px, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/25 to-transparent" />

                {/* Top Floating Status Pill */}
                <motion.div
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2"
                >
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-brand-950/75 px-3.5 py-1.5 text-[12px] font-semibold text-white backdrop-blur-md">
                    <RefreshCw className="size-3.5 animate-spin text-gold-300 [animation-duration:4s]" />
                    DeskFloow Live Workspace
                  </span>
                  <span className="rounded-full border border-emerald-400/40 bg-emerald-500/20 px-3 py-1 text-[11px] font-semibold text-emerald-200 backdrop-blur-md">
                    ● Connected Flow
                  </span>
                </motion.div>

                {/* Bottom Animated Live Event Card */}
                <div className="absolute inset-x-4 bottom-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentFeed.id}
                      initial={{ opacity: 0, y: 18, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -14, scale: 0.96 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-white/20 bg-brand-950/85 p-4 text-white shadow-xl backdrop-blur-xl"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-600 text-gold-300 shadow-sm">
                          <FeedIcon className="size-5" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-[14px] font-bold text-white">{currentFeed.title}</p>
                          <p className="truncate text-[12px] text-white/75">{currentFeed.meta}</p>
                        </div>
                      </div>
                      <span className="shrink-0 rounded-full border border-gold-300/40 bg-gold-400/20 px-2.5 py-1 text-[11px] font-bold text-gold-300">
                        {currentFeed.badge}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Interactive Animated Platform Capabilities Grid */}
      <section className="border-t border-line bg-gradient-to-b from-white via-brand-50/40 to-white py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            align="center"
            eyebrow="Unified Hotel Ecosystem"
            title="Every department connected in real time."
            lead="Explore the core hospitality modules that power daily hotel operations inside DeskFloow."
          />

          <motion.div
            variants={staggerGrid}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {capabilities.map((cap, idx) => {
              const isSelected = activeCap === idx;
              const CapIcon = cap.icon;
              return (
                <motion.div
                  key={cap.label}
                  variants={cardVariant}
                  whileHover={{ y: -6, scale: 1.01 }}
                  onMouseEnter={() => setActiveCap(idx)}
                  onClick={() => setActiveCap(idx)}
                  className={cn(
                    "group relative cursor-pointer overflow-hidden rounded-3xl border p-6 transition-all duration-300",
                    isSelected
                      ? "border-brand-400 bg-gradient-to-br from-brand-50/90 via-white to-gold-100/35 shadow-lift ring-2 ring-brand-500/20"
                      : "border-brand-200/75 bg-white shadow-sm hover:border-brand-300 hover:shadow-md",
                  )}
                >
                  <div className="pointer-events-none absolute -top-12 -right-12 size-28 rounded-full bg-brand-400/15 blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-40" />

                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={cn(
                        "grid size-11 shrink-0 place-items-center rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3",
                        isSelected
                          ? "bg-brand-600 text-white shadow-md"
                          : "bg-brand-100 text-brand-700 group-hover:bg-brand-600 group-hover:text-white",
                      )}
                    >
                      <CapIcon className="size-5" aria-hidden />
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-300/70 bg-gold-100/80 px-3 py-1 text-[11px] font-semibold text-brand-950">
                      <CheckCircle2 className="size-3 text-emerald-600" />
                      {cap.stat}
                    </span>
                  </div>

                  <h3 className="mt-5 text-[18px] font-bold tracking-tight text-ink group-hover:text-brand-700">
                    {cap.label}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{cap.desc}</p>

                  {/* Animated bottom progress bar */}
                  <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-brand-100">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-brand-600 via-brand-500 to-gold-400"
                      initial={false}
                      animate={{ width: isSelected ? "100%" : "35%" }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Animated Principles Section */}
      <section className="border-t border-line bg-gradient-to-b from-brand-50/50 to-white py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            align="center"
            eyebrow="How We Build"
            title="Principles behind the DeskFloow platform."
            lead="Every workflow in DeskFloow is designed around clarity, speed, and operational accuracy."
          />

          <motion.div
            variants={staggerGrid}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {pillars.map((p) => (
              <motion.article
                key={p.title}
                variants={cardVariant}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="group card relative flex flex-col justify-between overflow-hidden border border-brand-200/80 bg-white p-6 shadow-sm hover:border-brand-400 hover:shadow-lift"
              >
                <div className="pointer-events-none absolute -bottom-10 -right-10 size-24 rounded-full bg-gold-300/20 blur-2xl transition-opacity group-hover:opacity-100 opacity-0" />
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="grid size-11 place-items-center rounded-xl bg-brand-100 text-brand-700 transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white">
                      <p.icon className="size-5" aria-hidden />
                    </span>
                    <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700">
                      {p.tag}
                    </span>
                  </div>
                  <h3 className="mt-5 text-[18px] font-bold tracking-tight text-ink">{p.title}</h3>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-muted-foreground">{p.description}</p>
                </div>
                <div
                  className="mt-6 h-1 w-10 rounded-full bg-gradient-to-r from-brand-500 to-gold-400 transition-all duration-300 group-hover:w-full"
                  aria-hidden
                />
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}

