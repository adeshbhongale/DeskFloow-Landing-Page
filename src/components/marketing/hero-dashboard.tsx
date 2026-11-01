"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  BedDouble,
  CalendarCheck,
  DoorOpen,
  Network,
  Sparkles,
} from "lucide-react";
import { propertySnapshot } from "@/lib/metrics";
import { channels } from "@/data/channels";
import { cn } from "@/lib/utils";

const snap = propertySnapshot("grand-palace");
const cleanCount = snap.rooms.filter((r) => r.housekeeping === "clean").length;
const cleaningCount = snap.rooms.filter((r) => r.housekeeping === "cleaning").length;
const dirtyCount = snap.rooms.filter((r) => r.housekeeping === "dirty").length;
const demoChannelCount = channels.filter((c) => c.state === "demo").length;

interface KpiCardData {
  id: string;
  label: string;
  badge: string;
  icon: typeof BedDouble;
  headline: string;
  stats: { label: string; value: string; tone?: "default" | "brand" | "gold" | "success" }[];
}

const kpiCards: KpiCardData[] = [
  {
    id: "occupancy",
    label: "Live Occupancy",
    badge: `${snap.occupancy}% Occupied`,
    icon: BedDouble,
    headline: `${snap.occupancy}%`,
    stats: [
      { label: "Occupied", value: `${snap.inHouse.length} rooms`, tone: "brand" },
      { label: "Total rooms", value: `${snap.rooms.length} rooms`, tone: "default" },
      { label: "Occupancy", value: `${snap.occupancy}%`, tone: "gold" },
    ],
  },
  {
    id: "arrivals",
    label: "Today's Arrivals",
    badge: `${snap.arrivals.length + 2} Expected`,
    icon: CalendarCheck,
    headline: `${snap.arrivals.length + 2} Guests`,
    stats: [
      { label: "Expected", value: `${snap.arrivals.length + 2} arrivals`, tone: "brand" },
      { label: "Checked in", value: "2 guests", tone: "success" },
      { label: "Pending", value: `${snap.arrivals.length} check-ins`, tone: "gold" },
    ],
  },
  {
    id: "departures",
    label: "Today's Departures",
    badge: `${snap.departures.length + 2} Scheduled`,
    icon: DoorOpen,
    headline: `${snap.departures.length + 2} Checkouts`,
    stats: [
      { label: "Scheduled", value: `${snap.departures.length + 2} rooms`, tone: "brand" },
      { label: "Completed", value: `${snap.departures.length} departed`, tone: "success" },
      { label: "Pending", value: "2 in-house", tone: "gold" },
    ],
  },
  {
    id: "ota",
    label: "OTA Reservations",
    badge: `${demoChannelCount} Channels`,
    icon: Network,
    headline: `${snap.reservations.length} Bookings`,
    stats: [
      { label: "Direct & B.com", value: "5 bookings", tone: "brand" },
      { label: "Agoda & MMT", value: "5 bookings", tone: "default" },
      { label: "Sync status", value: "2-Way Live", tone: "success" },
    ],
  },
  {
    id: "housekeeping",
    label: "Housekeeping",
    badge: `${cleanCount}/${snap.rooms.length} Ready`,
    icon: Sparkles,
    headline: `${cleanCount} Clean`,
    stats: [
      { label: "Clean rooms", value: `${cleanCount} ready`, tone: "success" },
      { label: "In progress", value: `${cleaningCount} cleaning`, tone: "brand" },
      { label: "Turnaround", value: `${dirtyCount} dirty`, tone: "gold" },
    ],
  },
];

/**
 * Vertical 3-card KPI conveyor positioned on the right edge of the Hero image
 * (50% overlapping the image, 50% extending outside).
 * Middle card moves to top, bottom card moves to middle, and a new card enters at the bottom.
 */
export function HeroDashboard() {
  const [order, setOrder] = useState<number[]>(() => kpiCards.map((_, i) => i));
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => {
      if (!document.hidden) {
        setOrder((prev) => [...prev.slice(1), prev[0]]);
      }
    }, 2800);
    return () => clearTimeout(id);
  }, [order, paused]);

  const visibleCards = order.slice(0, 3);

  return (
    <div
      className="relative flex flex-col gap-5 sm:gap-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Live hotel KPI cards"
      role="region"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {visibleCards.map((cardIdx, slotIdx) => {
          const card = kpiCards[cardIdx];
          const Icon = card.icon;
          const isMiddle = slotIdx === 1;

          return (
            <motion.div
              key={card.id}
              layout
              initial={{ opacity: 0, y: 60, scale: 0.92 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: isMiddle ? 1.03 : 0.98,
              }}
              exit={{
                opacity: 0,
                y: -60,
                scale: 0.92,
              }}
              transition={{
                layout: { type: "spring", stiffness: 260, damping: 26 },
                opacity: { duration: 0.28 },
                scale: { duration: 0.28 },
              }}
              onClick={() => setOrder((prev) => [...prev.slice(1), prev[0]])}
              className={cn(
                "cursor-pointer rounded-2xl border bg-white/95 p-4 backdrop-blur-xl transition-shadow select-none sm:p-4.5",
                isMiddle
                  ? "border-brand-300 shadow-[0_20px_46px_-12px_rgb(53_19_125/0.32)] ring-2 ring-gold-400/55"
                  : "border-brand-200/85 shadow-[0_14px_32px_-12px_rgb(53_19_125/0.2)] ring-1 ring-white",
              )}
            >
              <div className="flex items-center justify-between gap-2.5">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className={cn(
                      "grid size-9 shrink-0 place-items-center rounded-xl text-white shadow-2xs",
                      isMiddle ? "bg-brand-600" : "bg-brand-500",
                    )}
                  >
                    <Icon className="size-4.5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate text-[14.5px] font-bold tracking-tight text-ink">
                      {card.label}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700">
                      <span className="size-1.5 rounded-full bg-gold-500" aria-hidden />
                      {card.badge}
                    </span>
                  </div>
                </div>

                <p className="shrink-0 text-[19px] leading-none font-extrabold tracking-tight text-ink">
                  {card.headline}
                </p>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {card.stats.map((st) => (
                  <div
                    key={st.label}
                    className="rounded-xl border border-brand-100 bg-brand-50/60 px-2.5 py-2"
                  >
                    <p className="truncate text-[10.5px] font-medium text-muted-foreground">{st.label}</p>
                    <p
                      className={cn(
                        "mt-0.5 truncate text-[12.5px] font-bold",
                        st.tone === "brand" && "text-brand-700",
                        st.tone === "gold" && "text-amber-700",
                        st.tone === "success" && "text-emerald-700",
                        (!st.tone || st.tone === "default") && "text-ink",
                      )}
                    >
                      {st.value}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
