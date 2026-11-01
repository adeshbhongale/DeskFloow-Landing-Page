"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  BedDouble,
  Briefcase,
  Building,
  Crown,
  Gem,
  Home,
  Hotel,
  MessageCircle,
  Network,
  Palmtree,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { RotatingWords } from "@/components/animations/rotating-words";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const rotatingPhrases = [
  "Manage Every Room.",
  "Sync Every Booking.",
  "Delight Every Guest.",
  "Grow Every Stay.",
];

const workspaceShowcases = [
  {
    phrase: "Manage Every Room.",
    module: "Housekeeping & Room Readiness",
    caption: "Live visual floor plans and instant dirty-room check-in guards across every floor.",
    image: "/images/housekeeping-ops-tablet.jpg",
    alt: "Hotel manager reviewing live housekeeping floor plan on a tablet",
    icon: Sparkles,
    badge: "Real-Time Room Status",
  },
  {
    phrase: "Sync Every Booking.",
    module: "Front Desk & OTA Synchronization",
    caption: "Reservations from direct bookings and connected channels unified on one reception screen.",
    image: "/images/frontdesk-tablet-reception.jpg",
    alt: "Front desk reception team managing guest reservations on tablet",
    icon: BedDouble,
    badge: "Unified Reservations",
  },
  {
    phrase: "Delight Every Guest.",
    module: "Guest Communication & Concierge",
    caption: "Automated WhatsApp booking confirmations, pre-arrival details, and room-service requests.",
    image: "/images/guest-mobile-experience.jpg",
    alt: "Hotel guest viewing digital room key and WhatsApp confirmation on smartphone",
    icon: MessageCircle,
    badge: "WhatsApp Workflow",
  },
  {
    phrase: "Grow Every Stay.",
    module: "Direct Bookings & Revenue Analytics",
    caption: "Commission-free direct booking experience paired with daily occupancy and ADR insights.",
    image: "/images/boutique-room.jpg",
    alt: "Boutique hotel guest room with city skyline view",
    icon: TrendingUp,
    badge: "Occupancy & Revenue",
  },
];

const types = [
  { label: "Independent hotels", icon: Hotel },
  { label: "Boutique inns", icon: Gem },
  { label: "Luxury resorts", icon: Palmtree },
  { label: "Homestays", icon: Home },
  { label: "Serviced apartments", icon: Building },
  { label: "Hotel groups", icon: Network },
  { label: "Heritage properties", icon: Crown },
  { label: "Business hotels", icon: Briefcase },
];

export function ValueStrip() {
  const [activeIdx, setActiveIdx] = useState(0);
  const currentShowcase = workspaceShowcases[activeIdx] ?? workspaceShowcases[0];
  const ShowcaseIcon = currentShowcase.icon;

  useEffect(() => {
    const id = setInterval(() => {
      if (!document.hidden) {
        setActiveIdx((prev) => (prev + 1) % workspaceShowcases.length);
      }
    }, 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden border-y border-line bg-white py-14 sm:py-20">
      <div className="container-x grid items-center gap-8 lg:gap-12 lg:grid-cols-[1.1fr_1fr]">
        {/* Left side preserved with clear line height so descenders never clip */}
        <Reveal className="min-w-0">
          <h2 className="text-[26px] min-[390px]:text-[31px] leading-[1.2] font-semibold tracking-[-0.03em] text-ink sm:text-[48px]">
            One workspace to
            <br />
            <RotatingWords
              className="bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent"
              words={rotatingPhrases}
              activeIndex={activeIdx}
            />
          </h2>
          <p className="lead mt-4 sm:mt-5 max-w-lg">
            Reservations, room readiness, guest conversations and revenue stay connected — so your team works from one
            clear picture instead of five disconnected tools.
          </p>
        </Reveal>

        {/* Right side: Image-based feature showcase synchronized with left side */}
        <Reveal delay={0.1} className="min-w-0">
          <div className="overflow-hidden rounded-[22px] sm:rounded-[26px] border border-brand-200/80 bg-gradient-to-br from-brand-50/70 via-white to-gold-100/30 p-2.5 sm:p-3 shadow-lift">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden rounded-2xl bg-brand-950">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentShowcase.phrase}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={currentShowcase.image}
                    alt={currentShowcase.alt}
                    fill
                    sizes="(min-width: 1024px) 540px, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/25 to-transparent" />

                  <div className="absolute top-2.5 left-2.5 right-2.5 sm:top-3.5 sm:left-3.5 sm:right-3.5 flex items-center justify-between gap-2">
                    <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full border border-white/20 bg-brand-950/75 px-2.5 py-1 sm:px-3 text-[11px] sm:text-[11.5px] font-semibold text-white backdrop-blur-md">
                      <ShowcaseIcon className="size-3.5 shrink-0 text-gold-300" />
                      <span className="truncate">{currentShowcase.module}</span>
                    </span>
                    <span className="hidden min-[420px]:inline-flex shrink-0 rounded-full border border-gold-300/40 bg-gold-400/20 px-2.5 py-0.5 text-[10.5px] sm:text-[11px] font-semibold text-gold-200 backdrop-blur-md">
                      {currentShowcase.badge}
                    </span>
                  </div>

                  <div className="absolute inset-x-2.5 bottom-2.5 sm:inset-x-3.5 sm:bottom-3.5 rounded-xl border border-white/15 bg-brand-950/85 p-2.5 sm:p-3.5 text-white backdrop-blur-md">
                    <p className="text-[12.5px] sm:text-[13px] font-semibold text-gold-300">{currentShowcase.phrase}</p>
                    <p className="mt-0.5 text-[11.5px] sm:text-[12.5px] leading-snug text-white/90">{currentShowcase.caption}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Interactive synchronization pills matching the 4 rotating states */}
            <div className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4" role="tablist" aria-label="Workspace capabilities">
              {workspaceShowcases.map((item, idx) => {
                const isSelected = idx === activeIdx;
                const ItemIcon = item.icon;
                return (
                  <button
                    key={item.phrase}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveIdx(idx)}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-xl px-2.5 py-2 text-[11.5px] font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
                      isSelected
                        ? "bg-brand-600 text-white shadow-sm"
                        : "bg-white/80 text-muted-foreground hover:bg-brand-50 hover:text-ink",
                    )}
                  >
                    <ItemIcon className={cn("size-3.5 shrink-0", isSelected ? "text-gold-300" : "text-brand-600")} />
                    <span className="truncate">{item.phrase.replace(".", "")}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Continuous running marquee with icons for each stay type */}
      <div className="mt-16 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <p className="mb-5 text-center text-[12px] font-medium tracking-widest text-muted-foreground uppercase">
          Designed for every kind of stay
        </p>
        <div className="flex w-max animate-marquee gap-3 py-2 hover:[animation-play-state:paused]">
          {[...types, ...types].map((t, i) => {
            const Icon = t.icon;
            return (
              <span
                key={i}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-brand-50/50 px-5 py-3.5 text-[15px] leading-relaxed text-ink/75 [transform:scaleY(1.18)]"
                aria-hidden={i >= types.length}
              >
                <Icon className="size-4.5 shrink-0 text-brand-600" aria-hidden />
                {t.label}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
