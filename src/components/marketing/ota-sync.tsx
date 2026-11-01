"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, CircleDashed, FlaskConical, Play, RefreshCw, X, Zap } from "lucide-react";
import { channels, channelStateLabel } from "@/data/channels";
import { demoReservations } from "@/data/demo-reservations";
import { guestById } from "@/data/demo-guests";
import { shortDate } from "@/lib/dates";
import { cn, inr } from "@/lib/utils";
import type { Channel } from "@/types";

const SIZE = 440;
const C = SIZE / 2;
const R = 165;
const pos = (i: number) => {
  const a = (i / channels.length) * Math.PI * 2 - Math.PI / 2;
  return { x: C + Math.cos(a) * R, y: C + Math.sin(a) * R };
};

const stream = [
  { text: "Direct website reservation received", meta: "Suite · 2 nights", channel: "direct" },
  { text: "OTA reservation synchronised", meta: "Booking.com · Deluxe", channel: "booking" },
  { text: "Guest confirmation sent", meta: "WhatsApp template", channel: "direct" },
  { text: "Room assignment updated", meta: "RSV-1047 → Room 103", channel: "agoda" },
  { text: "Availability pushed to channels", meta: "Premium · 3 rooms left", channel: "expedia" },
];

const stateIcon = { connected: CheckCircle2, "setup-required": CircleDashed, demo: FlaskConical };

export function OtaSync() {
  const [selected, setSelected] = useState<Channel>(channels[1]);
  const [pulse, setPulse] = useState<{ from: number; key: number } | null>(null);
  const [phase, setPhase] = useState<"idle" | "in" | "out">("idle");
  const [events, setEvents] = useState<{ id: number; text: string; meta: string }[]>([]);
  const [showStream, setShowStream] = useState(true);
  const k = useRef(0);
  const streamIdx = useRef(0);

  // Signature animation 03 — a calm stream of local demo events.
  useEffect(() => {
    if (!showStream) return;
    const tick = () => {
      if (document.hidden) return;
      const e = stream[streamIdx.current++ % stream.length];
      setEvents((ev) => [{ id: ++k.current, text: e.text, meta: e.meta }, ...ev].slice(0, 3));
    };
    tick();
    const id = setInterval(tick, 3800);
    return () => clearInterval(id);
  }, [showStream]);

  const simulate = (ch = selected) => {
    if (phase !== "idle") return;
    const from = channels.findIndex((c) => c.id === ch.id);
    setPulse({ from, key: ++k.current });
    setPhase("in");
    setTimeout(() => setPhase("out"), 900);
    setTimeout(() => {
      setPhase("idle");
      setEvents((ev) => [{ id: ++k.current, text: `${ch.name} booking ingested · inventory updated`, meta: "Availability propagated to other channels (simulated)" }, ...ev].slice(0, 3));
    }, 2000);
  };

  const examples = demoReservations.filter((r) => r.source === selected.name).slice(0, 3);
  const StateIcon = stateIcon[selected.state];

  return (
    <div className="grid min-w-0 items-start gap-8 sm:gap-10 lg:grid-cols-[1.1fr_1fr]">
      <div className="relative mx-auto w-full max-w-[310px] sm:max-w-[460px]">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full" aria-hidden>
          <defs>
            <radialGradient id="hubglow">
              <stop offset="0" stopColor="#8C5CFF" stopOpacity="0.55" />
              <stop offset="1" stopColor="#8C5CFF" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx={C} cy={C} r={R} fill="none" stroke="rgb(255 255 255 / .08)" strokeDasharray="3 6" />
          <circle cx={C} cy={C} r={110} fill="url(#hubglow)" />
          {channels.map((c, i) => {
            const p = pos(i);
            const active = c.id === selected.id;
            return (
              <line key={c.id} x1={C} y1={C} x2={p.x} y2={p.y} stroke={active ? "#FFC95C" : "rgb(255 255 255 / .14)"} strokeWidth={active ? 1.6 : 1} strokeDasharray={c.state === "setup-required" ? "4 5" : undefined} />
            );
          })}
          {/* inbound packet */}
          {pulse && phase === "in" && (
            <motion.circle key={`in-${pulse.key}`} r={6} fill="#FFC95C" initial={{ cx: pos(pulse.from).x, cy: pos(pulse.from).y }} animate={{ cx: C, cy: C }} transition={{ duration: 0.85, ease: "easeIn" }} />
          )}
          {/* outbound propagation to other demo channels */}
          {pulse && phase === "out" &&
            channels.map((c, i) =>
              i === pulse.from || c.state === "setup-required" ? null : (
                <motion.circle key={`out-${pulse.key}-${c.id}`} r={4} fill="#CBB5FF" initial={{ cx: C, cy: C, opacity: 1 }} animate={{ cx: pos(i).x, cy: pos(i).y, opacity: 0.2 }} transition={{ duration: 0.9, ease: "easeOut" }} />
              ),
            )}
        </svg>

        {/* hub */}
        <div className="absolute top-1/2 left-1/2 grid size-[92px] sm:size-[112px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-brand-800/80 text-center shadow-[0_0_60px_-10px_rgb(140_92_255/0.8)] backdrop-blur">
          <div>
            <RefreshCw className={cn("mx-auto size-4 sm:size-5 text-gold-300", phase !== "idle" && "animate-spin")} />
            <p className="mt-1 text-[11px] sm:text-[12px] font-semibold text-white">DeskFloow</p>
            <p className="text-[9.5px] sm:text-[10px] text-white/60">{phase === "in" ? "Ingesting…" : phase === "out" ? "Propagating…" : "Inventory engine"}</p>
          </div>
        </div>

        {/* channel nodes */}
        {channels.map((c, i) => {
          const p = pos(i);
          const active = c.id === selected.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              aria-pressed={active}
              aria-label={`${c.name}: ${channelStateLabel[c.state]}`}
              style={{ left: `${(p.x / SIZE) * 100}%`, top: `${(p.y / SIZE) * 100}%` }}
              className={cn(
                "absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5 sm:gap-1 transition",
                active ? "scale-105 sm:scale-110" : "opacity-80 hover:opacity-100",
              )}
            >
              <span
                className={cn("grid size-9 sm:size-11 place-items-center rounded-xl sm:rounded-2xl border text-[10.5px] sm:text-[12px] font-bold text-white shadow-lg", active ? "border-gold-300 ring-4 ring-gold-400/25" : "border-white/20")}
                style={{ background: c.color }}
              >
                {c.short}
              </span>
              <span className="rounded-full bg-brand-950/80 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10.5px] whitespace-nowrap text-white/85">{c.name}</span>
            </button>
          );
        })}
      </div>

      <div className="min-w-0 space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[12px] text-white/50">Selected channel</p>
              <p className="text-[20px] font-semibold text-white">{selected.name}</p>
            </div>
            <span className={cn("chip border", selected.state === "setup-required" ? "border-white/20 bg-white/5 text-white/70" : "border-gold-300/40 bg-gold-400/10 text-gold-200")}>
              <StateIcon className="size-3" /> {channelStateLabel[selected.state]}
            </span>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-[13px]">
            <div className="rounded-xl bg-white/5 p-3"><dt className="text-white/50">Last demo sync</dt><dd className="font-medium text-white">{selected.state === "setup-required" ? "Not configured" : "Simulated · just now"}</dd></div>
            <div className="rounded-xl bg-white/5 p-3"><dt className="text-white/50">Demo bookings</dt><dd className="font-medium text-white">{demoReservations.filter((r) => r.source === selected.name).length}</dd></div>
          </dl>
          {examples.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {examples.map((r) => (
                <li key={r.id} className="flex justify-between text-[12.5px] text-white/75">
                  <span>{r.id} · {guestById(r.guestId)?.name}</span>
                  <span className="text-white/50">{shortDate(r.checkIn)} · {inr(r.total)}</span>
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={() => simulate()}
            disabled={phase !== "idle" || selected.state === "setup-required"}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold-400 px-4 py-2 text-[13px] font-medium text-brand-950 transition hover:bg-gold-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Play className="size-3.5" /> {selected.state === "setup-required" ? "Setup required to simulate" : "Simulate incoming booking"}
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="flex items-center gap-2 text-[13px] font-semibold text-white"><Zap className="size-3.5 text-gold-300" /> Demo activity</p>
            <button onClick={() => setShowStream((s) => !s)} className="text-[12px] text-white/60 hover:text-white">{showStream ? "Pause" : "Resume"}</button>
          </div>
          <ul className="min-h-[156px] space-y-2" aria-live="polite">
            <AnimatePresence initial={false}>
              {events.map((e) => (
                <motion.li
                  key={e.id}
                  layout
                  initial={{ opacity: 0, y: -12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 30 }}
                  className="flex items-start gap-3 rounded-xl bg-white/[0.06] px-3 py-2.5"
                >
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold-300" />
                  <span className="flex-1">
                    <span className="block text-[13px] text-white">{e.text}</span>
                    <span className="block text-[11.5px] text-white/50">{e.meta}</span>
                  </span>
                  <button aria-label="Dismiss" onClick={() => setEvents((ev) => ev.filter((x) => x.id !== e.id))} className="rounded p-0.5 text-white/40 hover:text-white"><X className="size-3.5" /></button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
        <p className="text-[12px] leading-relaxed text-white/45">
          Channel names are shown for recognition only. No OTA integration is live in this prototype — every event is a
          local simulation. Real connections require channel-specific setup and testing.
        </p>
      </div>
    </div>
  );
}
