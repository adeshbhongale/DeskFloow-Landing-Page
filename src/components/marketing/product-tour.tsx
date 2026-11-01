"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw, MousePointer2, Crown, CheckCheck, Sparkles, BedDouble } from "lucide-react";
import { HkBadge } from "@/components/ui/badges";
import { cn } from "@/lib/utils";

const steps = [
  { key: "room", title: "Select a room", text: "Pick Room 203 from the live room grid." },
  { key: "open", title: "Open the reservation", text: "See the booking attached to the room." },
  { key: "profile", title: "Review the guest profile", text: "Preferences and loyalty appear instantly." },
  { key: "send", title: "Send a WhatsApp confirmation", text: "An approved template, personalised automatically." },
  { key: "ready", title: "Mark the room ready", text: "Housekeeping status updates everywhere." },
] as const;

type Key = (typeof steps)[number]["key"];
const roomsGrid = ["101", "102", "103", "104", "201", "202", "203", "204"];

/** Signature animation 07 — guided cursor tour with manual controls. */
export function ProductTour() {
  const [done, setDone] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [cursor, setCursor] = useState({ x: 40, y: 40 });
  const [clickKey, setClickKey] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView(box, { amount: 0.1 });
  const reduce = useReducedMotion();
  const finished = done >= steps.length;
  const current = steps[Math.min(done, steps.length - 1)];

  const measure = useCallback(() => {
    const root = box.current;
    const el = root?.querySelector(`[data-tour="${current.key}"]`);
    if (!el || !root) return;
    const a = el.getBoundingClientRect();
    const b = root.getBoundingClientRect();
    setCursor({ x: a.left - b.left + a.width / 2, y: a.top - b.top + a.height / 2 });
  }, [current.key]);

  useLayoutEffect(() => {
    measure();
    const t = setTimeout(measure, 450); // re-measure once enter animations settle
    return () => clearTimeout(t);
  }, [measure, done]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    if (!playing || !inView || reduce || finished) return;
    const id = setTimeout(() => {
      setClickKey((k) => k + 1);
      setDone((d) => d + 1);
    }, 2300);
    return () => clearTimeout(id);
  }, [playing, inView, reduce, finished, done]);

  const act = (k: Key) => {
    const idx = steps.findIndex((s) => s.key === k);
    if (idx === done) setDone(idx + 1);
  };
  const isTarget = (k: Key) => !finished && current.key === k;

  return (
    <div className="grid min-w-0 gap-5 sm:gap-6 lg:grid-cols-[300px_1fr]">
      <div className="min-w-0">
        <ol className="space-y-1.5">
          {steps.map((s, i) => (
            <li key={s.key}>
              <button
                onClick={() => (setPlaying(false), setDone(i))}
                className={cn(
                  "flex w-full gap-3 rounded-xl p-3 text-left transition",
                  i === done ? "bg-white shadow-card ring-1 ring-brand-200" : "hover:bg-white/60",
                )}
                aria-current={i === done ? "step" : undefined}
              >
                <span className={cn("grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold", i < done ? "bg-brand-600 text-white" : i === done ? "bg-gold-400 text-brand-950" : "bg-brand-100 text-brand-700")}>
                  {i < done ? "✓" : i + 1}
                </span>
                <span>
                  <span className="block text-[14px] font-medium text-ink">{s.title}</span>
                  <span className="block text-[12.5px] text-muted-foreground">{s.text}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={() => setPlaying((p) => !p)} disabled={finished} className="flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-brand-700 disabled:opacity-50">
            {playing && !finished ? <><Pause className="size-3.5" /> Pause</> : <><Play className="size-3.5" /> Play</>}
          </button>
          <button aria-label="Previous step" onClick={() => (setPlaying(false), setDone((d) => Math.max(0, d - 1)))} className="rounded-full border border-line bg-white p-2 hover:bg-brand-50"><ChevronLeft className="size-4" /></button>
          <button aria-label="Next step" onClick={() => (setPlaying(false), setClickKey((k) => k + 1), setDone((d) => Math.min(steps.length, d + 1)))} className="rounded-full border border-line bg-white p-2 hover:bg-brand-50"><ChevronRight className="size-4" /></button>
          <button onClick={() => (setDone(0), setPlaying(true))} className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-2 text-[13px] hover:bg-brand-50"><RotateCcw className="size-3.5" /> Restart</button>
        </div>
      </div>

      <div ref={box} className="relative min-w-0 overflow-hidden rounded-2xl border border-border bg-card p-3.5 sm:p-4 shadow-lift text-card-foreground">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[13px] font-semibold text-foreground">Grand Palace · Front Desk</p>
          <span className="chip bg-primary/10 text-primary font-semibold">Workflow Preview</span>
        </div>
        <div className="grid gap-4 md:grid-cols-[180px_1fr_170px]">
          {/* Room grid */}
          <div>
            <p className="mb-2 text-[11.5px] font-medium text-muted-foreground">Rooms</p>
            <div className="grid grid-cols-2 gap-1.5">
              {roomsGrid.map((n) => {
                const sel = n === "203" && done >= 1;
                return (
                  <button
                    key={n}
                    data-tour={n === "203" ? "room" : undefined}
                    onClick={() => n === "203" && act("room")}
                    className={cn("rounded-lg border px-2 py-2 text-[12.5px] font-semibold transition", sel ? "border-brand-500 bg-brand-600 text-white" : "border-line bg-brand-50/50 text-ink hover:border-brand-300", isTarget("room") && n === "203" && "ring-2 ring-gold-400")}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reservation + profile + message */}
          <div className="min-h-[300px] space-y-3">
            <AnimatePresence>
              {done >= 1 && (
                <motion.div key="room" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-xl border border-line p-3">
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-2 text-[13.5px] font-semibold"><BedDouble className="size-4 text-brand-500" /> Room 203 · Suite</p>
                    <HkBadge status={done >= 5 ? "clean" : "cleaning"} />
                  </div>
                  <button data-tour="open" onClick={() => act("open")} className={cn("mt-2 w-full rounded-lg bg-brand-50 px-3 py-2 text-left text-[12.5px] font-medium text-brand-800 hover:bg-brand-100", isTarget("open") && "ring-2 ring-gold-400")}>
                    Open reservation RSV-1048 →
                  </button>
                </motion.div>
              )}
              {done >= 2 && (
                <motion.div key="res" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-line p-3 text-[12.5px]">
                  <p className="font-semibold text-ink">Meera Joshi · 12–14 Nov · Direct Website</p>
                  <p className="text-muted-foreground">2 adults, 1 child · 50% paid · Anniversary</p>
                  <button data-tour="profile" onClick={() => act("profile")} className={cn("mt-2 rounded-lg border border-line px-3 py-1.5 font-medium hover:bg-brand-50", isTarget("profile") && "ring-2 ring-gold-400")}>
                    View guest profile
                  </button>
                  {done >= 3 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-2 flex flex-wrap gap-1.5">
                      <span className="chip bg-gradient-to-r from-brand-700 to-brand-500 text-white"><Crown className="size-3" /> Platinum · VIP</span>
                      <span className="chip bg-emerald-100 text-emerald-800">Jain diet</span>
                      <span className="chip bg-brand-100 text-brand-800">Welcome flowers</span>
                    </motion.div>
                  )}
                </motion.div>
              )}
              {done >= 3 && (
                <motion.div key="wa" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-line bg-brand-50/50 p-3">
                  {done >= 4 ? (
                    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="rounded-lg border border-brand-200 bg-white px-3 py-2 text-[12.5px] text-ink">
                      <span className="font-semibold text-brand-700">Campaign Dispatched:</span> Booking RSV-1048 confirmed for Meera (Suite 203 · 12 Nov) <CheckCheck className="inline size-3.5 text-emerald-600" />
                    </motion.div>
                  ) : (
                    <button data-tour="send" onClick={() => act("send")} className={cn("w-full rounded-lg bg-brand-600 px-3 py-2 text-[12.5px] font-medium text-white hover:bg-brand-700", isTarget("send") && "ring-2 ring-gold-400")}>
                      Dispatch confirmation campaign
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            {done === 0 && <p className="pt-16 text-center text-[13px] text-muted-foreground">Select a room to begin.</p>}
          </div>

          {/* Housekeeping */}
          <div className="rounded-xl border border-line p-3">
            <p className="text-[11.5px] font-medium text-muted-foreground">Housekeeping</p>
            <p className="mt-2 text-[13px] font-semibold">Room 203</p>
            <div className="mt-2"><HkBadge status={done >= 5 ? "clean" : "cleaning"} /></div>
            <button data-tour="ready" onClick={() => act("ready")} disabled={done < 4 || done >= 5} className={cn("mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-[12.5px] font-medium text-white hover:bg-brand-700 disabled:opacity-40", isTarget("ready") && "ring-2 ring-gold-400")}>
              <Sparkles className="size-3.5" /> {done >= 5 ? "Room ready" : "Mark ready"}
            </button>
          </div>
        </div>

        {finished && (
          <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-xl bg-emerald-50 px-4 py-2.5 text-[13px] font-medium text-emerald-800" role="status">
            Tour complete — the guest is confirmed and Room 203 is ready for arrival.
          </motion.p>
        )}

        {/* Simulated cursor: purely decorative, never intercepts input */}
        {!reduce && !finished && (
          <motion.div aria-hidden className="pointer-events-none absolute top-0 left-0 z-20" animate={{ x: cursor.x - 4, y: cursor.y - 2 }} transition={{ type: "spring", stiffness: 70, damping: 16 }}>
            <MousePointer2 className="size-6 fill-brand-700 text-white drop-shadow-lg" />
            <motion.span key={clickKey} className="absolute top-0 left-0 size-6 rounded-full border-2 border-gold-400" initial={{ scale: 0.3, opacity: 1 }} animate={{ scale: 2.2, opacity: 0 }} transition={{ duration: 0.6 }} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
