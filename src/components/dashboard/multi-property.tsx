"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useState } from "react";
import { Check } from "lucide-react";
import { CountUp } from "@/components/animations/count-up";
import { demoProperties } from "@/data/demo-properties";
import { propertySnapshot } from "@/lib/metrics";
import { cn, inr } from "@/lib/utils";
import type { PropertyId } from "@/types";

export function PropertySwitcher() {
  const [activeProperty, setActiveProperty] = useState<PropertyId>("grand-palace");
  const snap = propertySnapshot(activeProperty);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[1.2fr_1fr]">
      <div className="grid min-w-0 gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Active property preview">
        {demoProperties.map((p) => {
          const active = p.id === activeProperty;
          return (
            <button
              type="button"
              key={p.id}
              role="radio"
              aria-checked={active}
              onClick={() => setActiveProperty(p.id)}
              className={cn(
                "group relative overflow-hidden rounded-2xl text-left transition",
                active ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "opacity-80 hover:opacity-100",
              )}
            >
              <div className="relative aspect-[16/10] sm:aspect-[4/3]">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="(min-width: 1024px) 220px, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                <p className="text-[14px] font-semibold">{p.name}</p>
                <p className="text-[11.5px] text-white/80">{p.city} · {p.tagline}</p>
              </div>
              {active && (
                <span className="absolute top-2 right-2 grid size-6 place-items-center rounded-full bg-primary text-primary-foreground shadow">
                  <Check className="size-3.5" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <motion.div
        key={activeProperty}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="card grid min-w-0 grid-cols-2 gap-2.5 sm:gap-3 p-3.5 sm:p-4"
      >
        <Metric label="Occupancy" value={snap.occupancy} fmt={(n) => `${Math.round(n)}%`} />
        <Metric label="Arrivals today" value={snap.arrivals.length} />
        <Metric label="Available rooms" value={snap.rooms.length - snap.inHouse.length} />
        <Metric label="Revenue today" value={snap.revenueToday} fmt={inr} />
        <div className="col-span-2 rounded-xl bg-muted/40 p-3">
          <p className="text-[11.5px] font-medium text-muted-foreground">Top Booking Channels</p>
          <p className="mt-1 text-[12.5px] sm:text-[13px] font-semibold text-foreground">
            Direct Engine (52%) · Booking.com (26%) · MakeMyTrip (14%)
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function Metric({ label, value, fmt }: { label: string; value: number; fmt?: (n: number) => string }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-border/70 bg-card/60 p-3">
      <p className="truncate text-[11.5px] text-muted-foreground">{label}</p>
      <CountUp value={value} format={fmt} className="mt-1 block truncate text-[19px] sm:text-[22px] font-bold tracking-tight text-foreground" />
    </div>
  );
}
