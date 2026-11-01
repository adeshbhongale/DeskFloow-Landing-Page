"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import {
  Check,
  CheckCheck,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  CornerUpLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingSample {
  id: string;
  stageLabel: string;
  headline: string;
  reservationId: string;
  guestName: string;
  phone: string;
  hotel: string;
  room: string;
  checkIn: string;
  checkOut: string;
  amount: string;
  code: string;
  image: string;
  datePill: string;
  buttons: [string, string, string];
}

const BOOKING_SAMPLES: BookingSample[] = [
  {
    id: "b1",
    stageLabel: "1. Booking Confirmed",
    headline: "🏨 Booking Confirmed — RSV-1048",
    reservationId: "RSV-1048",
    guestName: "Meera",
    phone: "+91 98230 55401",
    hotel: "Grand Palace Hotel",
    room: "Royal Heritage Suite (Room 203)",
    checkIn: "Nov 12, 2026 (2:00 PM)",
    checkOut: "Nov 14, 2026 (11:00 AM)",
    amount: "₹23,000",
    code: "RSV-1048 (Booking Confirmed)",
    image: "/images/boutique-room.jpg",
    datePill: "Thu, Nov 12",
    buttons: ["View Booking Voucher", "Digital Key & Room Info", "Request Airport Pickup"],
  },
  {
    id: "b2",
    stageLabel: "2. Guest Check-In",
    headline: "🔑 Check-In Confirmed — Room 204",
    reservationId: "RSV-1047",
    guestName: "Kabir",
    phone: "+91 90080 33218",
    hotel: "Grand Palace Hotel",
    room: "Deluxe Garden Room (Room 204)",
    checkIn: "Nov 12, 2026 (Checked-In ✓)",
    checkOut: "Nov 15, 2026 (11:00 AM)",
    amount: "₹15,600",
    code: "RSV-1047 (Checked-In)",
    image: "/images/resort.jpg",
    datePill: "Thu, Nov 12",
    buttons: ["Unlock Digital Room Key", "Room & Wi-Fi Details", "Contact Front Desk"],
  },
  {
    id: "b3",
    stageLabel: "3. Guest Check-Out",
    headline: "🧾 Check-Out Complete — RSV-1036",
    reservationId: "RSV-1036",
    guestName: "Ananya",
    phone: "+91 98840 12093",
    hotel: "Grand Palace Hotel",
    room: "Heritage Lake Suite (Room 201)",
    checkIn: "Nov 10, 2026 (2:00 PM)",
    checkOut: "Nov 13, 2026 (Completed ✓)",
    amount: "₹38,640",
    code: "INV-1036 (Folio Settled)",
    image: "/images/room-service.jpg",
    datePill: "Fri, Nov 13",
    buttons: ["Download Final Invoice", "Share Stay Feedback", "Book Next Stay"],
  },
];

const WHATSAPP_IMAGES = [
  {
    id: "wa-hospitality-hero",
    badge: "Booking, Check-In & Out Alerts",
    title: "Automated Guest Booking, Check-In & Check-Out Alerts",
    src: "/images/whatsapp-guest-alerts-hero.png",
    width: 1280,
    height: 760,
  },
  {
    id: "wa-mobile-confirm",
    badge: "Booking Confirmation Message",
    title: "Instant Booking Confirmation Message Sent to Guest",
    src: "/images/whatsapp-guest-booking-ui.png",
    width: 1200,
    height: 800,
  },
  {
    id: "wa-checkin-spa",
    badge: "Check-In & Check-Out Messages",
    title: "Automated Guest Check-In Welcome & Check-Out Invoice Messages",
    src: "/images/whatsapp-guest-checkin-checkout-ui.png",
    width: 1280,
    height: 840,
  },
] as const;

type SendPhase = "composing" | "sending" | "delivered" | "read";

export function WhatsAppInbox() {
  const [selected, setSelected] = useState<BookingSample>(BOOKING_SAMPLES[0]);
  const [phase, setPhase] = useState<SendPhase>("composing");
  const [cycleKey, setCycleKey] = useState(0);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { amount: 0.15 });

  useEffect(() => {
    if (!inView) return;

    const t0 = setTimeout(() => setPhase("composing"), 0);
    const t1 = setTimeout(() => setPhase("sending"), 900);
    const t2 = setTimeout(() => setPhase("delivered"), 1750);
    const t3 = setTimeout(() => setPhase("read"), 2550);
    const tLoop = setTimeout(() => {
      setCycleKey((k) => k + 1);
      setActiveImageIdx((i) => (i + 1) % WHATSAPP_IMAGES.length);
      setSelected((prev) => {
        const idx = BOOKING_SAMPLES.findIndex((b) => b.id === prev.id);
        return BOOKING_SAMPLES[(idx + 1) % BOOKING_SAMPLES.length];
      });
    }, 6800);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tLoop);
    };
  }, [inView, selected.id, cycleKey]);

  const activeImage = WHATSAPP_IMAGES[activeImageIdx];

  return (
    <div ref={containerRef} className="min-w-0 space-y-6">
      {/* Main Grid: Live Animated iPhone Mobile App UI + 3 Branded Mobile App UI Images */}
      <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[380px_1fr]">
        {/* Left: iPhone Mobile App UI Frame with Live Booking / Check-In / Check-Out Animation */}
        <div className="mx-auto w-full min-w-0 max-w-[340px] sm:max-w-[370px] px-1.5 sm:px-0">
          <div className="relative rounded-[44px] sm:rounded-[52px] border-[4px] border-slate-600 bg-[#090D16] p-2 sm:p-2.5 shadow-2xl">
            <span className="pointer-events-none absolute top-28 -left-[6px] h-9 w-[3px] rounded-l bg-slate-600" />
            <span className="pointer-events-none absolute top-40 -left-[6px] h-14 w-[3px] rounded-l bg-slate-600" />
            <span className="pointer-events-none absolute top-36 -right-[6px] h-18 w-[3px] rounded-r bg-slate-600" />

            <div className="overflow-hidden rounded-[42px] bg-[#EFEAE2]">
              <div className="border-b border-[#E2E0D8] bg-[#F6F5F0] px-4 pt-2.5 pb-3">
                <div className="flex items-center justify-between text-[11.5px] font-bold text-[#111B21]">
                  <span className="pl-1">9:41</span>
                  <span className="h-6 w-24 rounded-full bg-[#090D16]" aria-hidden />
                  <span className="flex items-center gap-1.5 pr-1">
                    <span className="inline-flex items-end gap-[1.5px]" aria-hidden>
                      <span className="h-1.5 w-[2.5px] rounded-xs bg-[#111B21]" />
                      <span className="h-2.5 w-[2.5px] rounded-xs bg-[#111B21]" />
                      <span className="h-3 w-[2.5px] rounded-xs bg-[#111B21]" />
                    </span>
                    <span className="rounded-md bg-[#FACC15] px-1.5 py-0.5 text-[9.5px] font-extrabold text-[#111B21]">
                      88
                    </span>
                  </span>
                </div>

                <div className="mt-2.5 flex items-center gap-2.5">
                  <ChevronLeft className="size-5 text-[#111B21]" />
                  <div className="grid size-9 shrink-0 place-items-center rounded-full border border-purple-300 bg-white p-1 shadow-2xs">
                    <Image
                      src="/images/deskfloow-logo.png"
                      alt="DeskFloow"
                      width={26}
                      height={20}
                      className="object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 truncate text-[13.5px] font-bold text-[#111B21]">
                      <span className="truncate">{selected.hotel}</span>
                      <span
                        title="Verified Business"
                        className="inline-grid size-4 shrink-0 place-items-center rounded-full bg-[#1D9BF0] text-[9.5px] font-bold text-white"
                      >
                        ✓
                      </span>
                    </p>
                    <p className="truncate text-[10.5px] text-[#54656F]">
                      {phase === "composing" ? "DeskFloow auto-sending guest alert…" : "Automated Booking, Check-In & Out"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative flex min-h-[500px] flex-col justify-between bg-[#EFEAE2] bg-[radial-gradient(#dfd8cc_1px,transparent_1px)] [background-size:18px_18px] px-3.5 pt-3 pb-3">
                <div>
                  <div className="mb-3 flex justify-center">
                    <span className="rounded-full bg-white px-3.5 py-1 text-[11px] font-bold text-[#54656F] shadow-2xs">
                      {selected.datePill}
                    </span>
                  </div>

                  <AnimatePresence mode="wait">
                    {phase === "composing" ? (
                      <motion.div
                        key={`composing-${selected.id}-${cycleKey}`}
                        initial={{ opacity: 0, y: 16, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.94 }}
                        transition={{ duration: 0.25 }}
                        className="mt-14 rounded-2xl bg-white p-5 text-center shadow-md"
                      >
                        <div className="mx-auto mb-2.5 flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1">
                          <span className="size-2 animate-bounce rounded-full bg-[#008069] [animation-delay:0ms]" />
                          <span className="size-2 animate-bounce rounded-full bg-[#008069] [animation-delay:150ms]" />
                          <span className="size-2 animate-bounce rounded-full bg-[#008069] [animation-delay:300ms]" />
                        </div>
                        <p className="text-[12.5px] font-bold text-[#111B21]">
                          Dispatching {selected.stageLabel.slice(3)}…
                        </p>
                        <p className="mt-1 text-[11px] text-[#54656F]">
                          Sending to {selected.guestName} ({selected.phone})
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key={`card-${selected.id}-${cycleKey}`}
                        initial={{ opacity: 0, y: 54, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 250, damping: 22 }}
                        className="overflow-hidden rounded-[20px] bg-white p-2 shadow-md ring-1 ring-black/5"
                      >
                        <div className="relative h-36 w-full overflow-hidden rounded-[14px]">
                          <Image
                            src={selected.image}
                            alt={selected.room}
                            fill
                            sizes="320px"
                            className="object-cover"
                          />
                          <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-full bg-[#160B33]/85 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-xs">
                            <Image
                              src="/images/deskfloow-logo.png"
                              alt="DeskFloow"
                              width={16}
                              height={13}
                              className="object-contain"
                            />
                            <span>DeskFloow</span>
                          </div>
                        </div>

                        <div className="px-2 pt-2.5 pb-2 text-[12px] leading-snug text-[#111B21]">
                          <p className="text-[13px] font-bold text-[#111B21]">
                            {selected.headline}
                          </p>
                          <p className="mt-1.5 text-[#111B21]/90">
                            Hey <strong>{selected.guestName}</strong>, your stay at &ldquo;
                            <strong>{selected.hotel}</strong>&rdquo; for{" "}
                            <strong>{selected.room}</strong> is updated!
                          </p>

                          <div className="mt-2.5 space-y-0.5 text-[11.5px]">
                            <p>
                              Check-in: <strong>{selected.checkIn}</strong>
                            </p>
                            <p>
                              Check-out: <strong>{selected.checkOut}</strong> | Paid:{" "}
                              <strong>{selected.amount}</strong>
                            </p>
                            <p className="font-bold text-[#008069]">
                              Ref: {selected.code}
                            </p>
                          </div>

                          <div className="mt-2 flex items-center justify-between text-[11px] text-[#54656F]">
                            <span>Automated via DeskFloow ✨</span>
                            <span className="flex items-center gap-1 font-semibold">
                              <span>09:02 AM</span>
                              {phase === "sending" && <Check className="size-3.5 text-[#667781]" />}
                              {phase === "delivered" && <CheckCheck className="size-3.5 text-[#667781]" />}
                              {phase === "read" && (
                                <motion.span
                                  initial={{ scale: 0.7 }}
                                  animate={{ scale: 1 }}
                                  className="inline-flex items-center text-[#0284C7]"
                                >
                                  <CheckCheck className="size-4" />
                                </motion.span>
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="mt-1 divide-y divide-slate-200/80 border-t border-slate-200/80 text-center text-[12px] font-semibold text-[#008069]">
                          {selected.buttons.map((btn) => (
                            <div
                              key={btn}
                              className="flex items-center justify-center gap-1.5 py-2 transition hover:bg-emerald-50/50"
                            >
                              <CornerUpLeft className="size-3.5" />
                              <span>{btn}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-3 flex justify-center">
                  <span className="h-1 w-24 rounded-full bg-[#111B21]/80" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: 3 Mobile App UI Images Gallery + Interactive Guest Trigger Controls */}
        <div className="min-w-0 space-y-4">
          <div className="card min-w-0 overflow-hidden p-3 sm:p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Guest message mobile UI views">
                {WHATSAPP_IMAGES.map((img, idx) => {
                  const active = idx === activeImageIdx;
                  return (
                    <button
                      key={img.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActiveImageIdx(idx)}
                      className={cn(
                        "rounded-full px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-[12px] font-semibold transition",
                        active
                          ? "bg-[#008069] text-white shadow-xs"
                          : "bg-emerald-50 text-[#008069] hover:bg-emerald-100",
                      )}
                    >
                      {img.badge}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIdx((i) => (i - 1 + WHATSAPP_IMAGES.length) % WHATSAPP_IMAGES.length)
                  }
                  aria-label="Previous image"
                  className="rounded-full border border-border bg-card p-1.5 hover:bg-muted"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImageIdx((i) => (i + 1) % WHATSAPP_IMAGES.length)}
                  aria-label="Next image"
                  className="rounded-full border border-border bg-card p-1.5 hover:bg-muted"
                >
                  <ChevronRight className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setCycleKey((k) => k + 1)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#008069] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[#005C4B]"
                >
                  <RotateCcw className="size-3.5" /> Replay Send
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage.id}
                initial={{ opacity: 0, y: 12, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.985 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden rounded-2xl border border-border shadow-md"
              >
                <Image
                  src={activeImage.src}
                  alt={activeImage.title}
                  width={activeImage.width}
                  height={activeImage.height}
                  unoptimized
                  className="h-auto w-full object-cover"
                />
              </motion.div>
            </AnimatePresence>

            <div className="mt-3 grid grid-cols-3 gap-2.5">
              {WHATSAPP_IMAGES.map((img, idx) => {
                const active = idx === activeImageIdx;
                return (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={cn(
                      "group overflow-hidden rounded-xl border p-1.5 text-left transition",
                      active
                        ? "border-[#008069] bg-emerald-50/40 ring-2 ring-[#008069]/30"
                        : "border-border opacity-80 hover:opacity-100",
                    )}
                  >
                    <div className="overflow-hidden rounded-lg border border-border/60">
                      <Image
                        src={img.src}
                        alt={img.badge}
                        width={img.width}
                        height={img.height}
                        unoptimized
                        className="h-auto w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                    <p className="mt-1.5 truncate px-1 text-[11px] font-bold text-foreground">
                      {img.badge}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
