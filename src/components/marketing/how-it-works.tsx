"use client";

import { AnimatePresence, motion, useInView, useScroll, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Building2, Network, UsersRound, Sparkles, LineChart, Check } from "lucide-react";
import { SectionHeading } from "@/components/ui/reveal";
import { HkBadge } from "@/components/ui/badges";
import { cn } from "@/lib/utils";

const steps = [
  { icon: Building2, title: "Connect your property and room inventory", text: "Add floors, room categories and rates — or generate rooms in bulk and arrange them on a floor plan." },
  { icon: Network, title: "Configure reservation channels and booking rules", text: "Set up your direct booking page and connect the channels you use, with clear status for each." },
  { icon: UsersRound, title: "Unify guest profiles and communication", text: "Every reservation links to one guest profile, with messages and orders attached to the stay." },
  { icon: Sparkles, title: "Coordinate the front desk and housekeeping", text: "Room readiness flows into check-in, so a dirty room can't be assigned by accident." },
  { icon: LineChart, title: "Monitor performance and optimise operations", text: "Occupancy, revenue and source mix every morning, per property or across your group." },
];

function Mini({ i }: { i: number }) {
  const base = "rounded-2xl border border-line bg-white p-5 shadow-lift";
  if (i === 0)
    return (
      <div className={base}>
        <p className="mb-3 text-[12px] font-semibold text-muted-foreground">Floor 2 · 4 rooms</p>
        <div className="grid grid-cols-4 gap-2">
          {["201", "202", "203", "204"].map((n, k) => (
            <motion.div key={n} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: k * 0.08 }} className="rounded-lg border border-brand-200 bg-brand-50 py-4 text-center text-[13px] font-semibold">{n}</motion.div>
          ))}
        </div>
      </div>
    );
  if (i === 1)
    return (
      <div className={base}>
        {["Direct Website", "Booking.com", "Agoda", "MakeMyTrip"].map((c, k) => (
          <div key={c} className="flex items-center justify-between border-b border-line py-2.5 text-[13px] last:border-0">
            {c}
            <span className={cn("chip", k === 3 ? "bg-slate-100 text-slate-600" : "bg-gold-100 text-gold-600")}>{k === 3 ? "Setup required" : "Demo simulation"}</span>
          </div>
        ))}
      </div>
    );
  if (i === 2)
    return (
      <div className={base}>
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full bg-brand-600 text-[14px] font-semibold text-white">VS</span>
          <div><p className="text-[14px] font-semibold">Vikram Singh</p><p className="text-[12px] text-muted-foreground">11 stays · Platinum</p></div>
        </div>
        <div className="mt-3 space-y-1.5 text-[12.5px]">
          <p className="rounded-lg bg-brand-50 px-3 py-2">RSV-1043 · Room 104 · Corporate</p>
          <p className="rounded-lg bg-emerald-50 px-3 py-2">WhatsApp · “Early breakfast please”</p>
          <p className="rounded-lg bg-gold-100/60 px-3 py-2">ORD-501 · Continental breakfast</p>
        </div>
      </div>
    );
  if (i === 3)
    return (
      <div className={base}>
        <div className="flex items-center justify-between text-[13px]"><span className="font-semibold">Room 103</span><HkBadge status="dirty" /></div>
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-[12.5px] text-amber-900">Check-in blocked — room is dirty. Manager override required.</p>
        <div className="mt-3 flex items-center justify-between text-[13px]"><span className="font-semibold">Room 203</span><HkBadge status="clean" /></div>
      </div>
    );
  return (
    <div className={base}>
      <p className="text-[12px] font-semibold text-muted-foreground">Occupancy · 7 days</p>
      <div className="mt-3 flex h-28 items-end gap-2">
        {[62, 68, 64, 74, 81, 92, 75].map((v, k) => (
          <motion.div key={k} initial={{ height: 0 }} animate={{ height: `${v}%` }} transition={{ delay: k * 0.05 }} className={cn("flex-1 rounded-t-md", k === 5 ? "bg-gold-400" : "bg-brand-400")} />
        ))}
      </div>
    </div>
  );
}

function Step({ i, onActive, active }: { i: number; onActive: (i: number) => void; active: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (inView) onActive(i);
  }, [inView, i, onActive]);
  const s = steps[i];
  return (
    <li ref={ref} className="relative pb-12 pl-12 sm:pb-16 sm:pl-14 last:pb-0 lg:min-h-[38vh]">
      <span className={cn("absolute top-0 left-0 grid size-9 sm:size-10 place-items-center rounded-xl border-2 bg-white transition", active ? "border-gold-400 text-gold-600 shadow-glow" : "border-brand-200 text-brand-500")}>
        <s.icon className="size-4 sm:size-4.5" />
      </span>
      <p className="text-[11.5px] sm:text-[12px] font-semibold tracking-widest text-muted-foreground uppercase">Step {i + 1}</p>
      <h3 className={cn("mt-1 text-[18.5px] sm:text-[22px] leading-tight font-semibold tracking-tight transition-colors", active ? "text-ink" : "text-ink/55")}>{s.title}</h3>
      <p className="mt-2 max-w-md text-[14px] sm:text-[15px] text-muted-foreground">{s.text}</p>
      {/* On small screens the mini UI sits inline with its step */}
      <div className="mt-4 sm:mt-5 lg:hidden"><Mini i={i} /></div>
      {active && <Check className="sr-only" aria-label="Current step" />}
    </li>
  );
}

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 60%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="how-it-works" className="scroll-mt-20 bg-gradient-to-b from-brand-50 to-white py-16 sm:py-32">
      <div className="container-x">
        <SectionHeading eyebrow="How DeskFloow works" title="Set up once. Run every day in flow." lead="Five steps from an empty account to a hotel where reservations, rooms and guests stay in sync." />
        <div className="mt-10 sm:mt-16 grid gap-12 lg:grid-cols-2">
          <ol ref={listRef} className="relative min-w-0">
            <div className="absolute top-2 bottom-2 left-[17px] sm:left-[19px] w-[2px] bg-brand-100" aria-hidden>
              <motion.div className="h-full w-full origin-top bg-gradient-to-b from-brand-500 to-gold-400" style={{ scaleY }} />
            </div>
            {steps.map((_, i) => <Step key={i} i={i} active={active === i} onActive={setActive} />)}
          </ol>
          <div className="hidden lg:block">
            <div className="sticky top-32">
              <AnimatePresence mode="wait">
                <motion.div key={active} initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4 }}>
                  <Mini i={active} />
                </motion.div>
              </AnimatePresence>
              <p className="mt-3 text-center text-[12px] text-muted-foreground">Illustrative interface · demo data</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
