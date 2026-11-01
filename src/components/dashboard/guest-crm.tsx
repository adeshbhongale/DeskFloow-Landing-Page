"use client";

import { cn, inr } from "@/lib/utils";
import {
  BedDouble,
  BellRing,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  GripVertical,
  MousePointer2,
  Pause,
  Phone,
  Play,
  RotateCcw,
  Send,
  ShieldCheck,
  UserPlus,
  UserRound,
} from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const steps = [
  {
    key: "add",
    title: "Drag & drop to add new guest",
    text: "Drag the new guest card for Meera Joshi from the palette into the Guest Directory.",
    ghostLabel: "+ Add Guest · Meera Joshi",
  },
  {
    key: "kyc",
    title: "Attach guest ID & room details",
    text: "Drop Aadhaar ID verification and Room 203 stay details onto Meera Joshi's profile.",
    ghostLabel: "✓ ID Verified · Room 203",
  },
  {
    key: "service",
    title: "Add guest service request",
    text: "Drop 'Airport Pickup & Breakfast' onto Meera's profile to log her service needs.",
    ghostLabel: "+ Airport Pickup & Breakfast",
  },
  {
    key: "message",
    title: "Send service message to guest",
    text: "Drop 'Send Service Message' onto Meera's card to send room & service updates to her phone.",
    ghostLabel: "✉ Send Service Message",
  },
  {
    key: "profile",
    title: "View full guest profile & message log",
    text: "Click any guest card to view their complete profile, stay details, and sent messages.",
    ghostLabel: "View Guest Profile",
  },
] as const;

type StepKey = (typeof steps)[number]["key"];
type StayStatus = "Checked-In" | "Arriving Today" | "In-House";

interface GuestProfileItem {
  id: string;
  group: 1 | 2;
  name: string;
  city: string;
  phone: string;
  email: string;
  room: string;
  stayDates: string;
  status: StayStatus;
  folioAmount: number;
  idVerified: boolean;
  idDoc: string;
  serviceSummary: string;
  services: string[];
  messageSent: boolean;
  lastMessage: string;
}

const SERVICE_MESSAGE_TEMPLATES = [
  "Room 203 is ready! Wi-Fi: GrandPalace_Guest (Pass: Stay2026) & breakfast 7–10:30 AM.",
  "Your airport pickup cab (RJ-14-TB-4092) is scheduled and confirmed for 1:30 PM.",
  "Your in-room dining & housekeeping request has been assigned to our staff.",
  "Thank you for staying with us! Your digital folio invoice has been shared.",
];

const BASE_GUESTS: GuestProfileItem[] = [
  {
    id: "g-aarav",
    group: 1,
    name: "Aarav Mehta",
    city: "Mumbai",
    phone: "+91 98201 44110",
    email: "aarav.mehta@finserve.in",
    room: "Room 101 · Standard",
    stayDates: "11 Nov – 14 Nov",
    status: "Checked-In",
    folioAmount: 15200,
    idVerified: true,
    idDoc: "Aadhaar ···· 7392 (Verified)",
    serviceSummary: "Wi-Fi & Breakfast Sent",
    services: ["Complimentary Breakfast", "Early Check-In", "Morning Newspaper"],
    messageSent: true,
    lastMessage: "Welcome Aarav! Room 101 Wi-Fi & breakfast timings have been sent to your phone.",
  },
  {
    id: "g-ananya",
    group: 1,
    name: "Ananya Iyer",
    city: "Bengaluru",
    phone: "+91 98840 12093",
    email: "ananya@studioiyer.com",
    room: "Room 201 · Premium",
    stayDates: "10 Nov – 13 Nov",
    status: "Checked-In",
    folioAmount: 27600,
    idVerified: true,
    idDoc: "Passport #K9042118 (Verified)",
    serviceSummary: "Airport Drop & Laundry",
    services: ["Airport Drop 4:00 PM", "Express Laundry", "Quiet Wing Room"],
    messageSent: true,
    lastMessage: "Hi Ananya, your express laundry order is complete and delivered to Room 201.",
  },
  {
    id: "g-vikram",
    group: 1,
    name: "Vikram Singh",
    city: "Udaipur",
    phone: "+91 98112 77804",
    email: "vikram.singh@mewar.co",
    room: "Room 104 · Deluxe",
    stayDates: "12 Nov – 15 Nov",
    status: "Checked-In",
    folioAmount: 20800,
    idVerified: true,
    idDoc: "Aadhaar ···· 5510 (Verified)",
    serviceSummary: "Extra Bedding & Room Dining",
    services: ["Extra Rollaway Bed", "Room Dining Order #402", "Late Check-Out"],
    messageSent: true,
    lastMessage: "Hi Vikram, your extra bedding and dinner tray are on the way to Room 104.",
  },
  {
    id: "g-kabir",
    group: 2,
    name: "Kabir Sharma",
    city: "New Delhi",
    phone: "+91 90080 33218",
    email: "kabir.sharma@cloudnine.io",
    room: "Room 204 · Deluxe",
    stayDates: "12 Nov – 15 Nov",
    status: "In-House",
    folioAmount: 15600,
    idVerified: true,
    idDoc: "Aadhaar ···· 2190 (Verified)",
    serviceSummary: "Digital Key & Pool Towels",
    services: ["Digital Key Shared", "Extra Pool Towels", "2 PM Check-Out"],
    messageSent: true,
    lastMessage: "Hi Kabir, your Room 204 digital key and pool access pass are active.",
  },
  {
    id: "g-james",
    group: 2,
    name: "James Carter",
    city: "London",
    phone: "+44 7700 900412",
    email: "j.carter@ukmail.co.uk",
    room: "Room 202 · Premium",
    stayDates: "12 Nov – 16 Nov",
    status: "In-House",
    folioAmount: 27600,
    idVerified: true,
    idDoc: "UK Passport #P449102",
    serviceSummary: "City Tour Cab & Breakfast",
    services: ["City Guide Cab 10 AM", "Continental Breakfast", "Adapter Plug"],
    messageSent: true,
    lastMessage: "Hi James, your sightseeing cab will be waiting at the main porch at 10:00 AM.",
  },
];

const STATUS_META: Record<StayStatus, { badge: string; dot: string }> = {
  "Checked-In": {
    badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
    dot: "bg-emerald-500",
  },
  "In-House": {
    badge: "bg-brand-50 text-brand-800 border-brand-200",
    dot: "bg-brand-600",
  },
  "Arriving Today": {
    badge: "bg-amber-50 text-amber-800 border-amber-200",
    dot: "bg-amber-500",
  },
};

export function GuestCrm() {
  const [done, setDone] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [dragPhase, setDragPhase] = useState<"source" | "target">("source");
  const [coords, setCoords] = useState({
    fromX: 80,
    fromY: 60,
    toX: 260,
    toY: 220,
  });
  const [clickKey, setClickKey] = useState(0);
  const [selectedGuestId, setSelectedGuestId] = useState("g-aarav");
  const [customMessages, setCustomMessages] = useState<Record<string, { text: string; idx: number }>>({});

  const boxRef = useRef<HTMLDivElement>(null);
  const inView = useInView(boxRef, { amount: 0.15 });

  const finished = done >= steps.length;
  const current = steps[Math.min(done, steps.length - 1)];

  const guestAdded = done >= 1;
  const kycAttached = done >= 2;
  const serviceAdded = done >= 3;
  const messageSentStep = done >= 4;

  const meeraProfile: GuestProfileItem = {
    id: "g-meera",
    group: 2,
    name: "Meera Joshi",
    city: "Jaipur",
    phone: "+91 98230 55401",
    email: "meera.joshi@heritagecraft.in",
    room: kycAttached ? "Room 203 · Suite" : "Room 203 (Assigning)",
    stayDates: "12 Nov – 14 Nov",
    status: kycAttached ? "Checked-In" : "Arriving Today",
    folioAmount: 23000,
    idVerified: kycAttached,
    idDoc: kycAttached ? "Aadhaar ···· 4821 (Verified ✓)" : "ID Proof Pending",
    serviceSummary: messageSentStep
      ? "Service Msg Sent ✓ · Room 203"
      : serviceAdded
        ? "Airport Pickup · Breakfast"
        : "New Guest Profile Added",
    services: serviceAdded
      ? ["Airport Pickup 1:30 PM", "Complimentary Breakfast", "Fresh Fruit Basket"]
      : ["Room 203 Reservation"],
    messageSent: messageSentStep || Boolean(customMessages["g-meera"]),
    lastMessage:
      customMessages["g-meera"]?.text ??
      (messageSentStep
        ? "Hi Meera! Room 203 check-in, Wi-Fi details & your 1:30 PM airport pickup are confirmed."
        : "Ready to send welcome & room service details to +91 98230 55401."),
  };

  const computedGuests: GuestProfileItem[] = [
    ...BASE_GUESTS.map((g) => ({
      ...g,
      lastMessage: customMessages[g.id]?.text ?? g.lastMessage,
    })),
    ...(guestAdded ? [meeraProfile] : []),
  ];

  const activeGuestId = guestAdded ? "g-meera" : selectedGuestId;
  const selectedGuest =
    computedGuests.find((g) => g.id === (guestAdded && selectedGuestId === "g-aarav" ? "g-meera" : selectedGuestId)) ??
    computedGuests.find((g) => g.id === activeGuestId) ??
    computedGuests[0];

  const measure = useCallback(() => {
    const root = boxRef.current;
    if (!root) return;
    const srcEl = root.querySelector(`[data-crm-source="${current.key}"]`);
    const dstEl = root.querySelector(`[data-crm-target="${current.key}"]`);
    const rootRect = root.getBoundingClientRect();

    if (srcEl && dstEl) {
      const s = srcEl.getBoundingClientRect();
      const d = dstEl.getBoundingClientRect();
      setCoords({
        fromX: s.left - rootRect.left + s.width / 2,
        fromY: s.top - rootRect.top + s.height / 2,
        toX: d.left - rootRect.left + d.width / 2,
        toY: d.top - rootRect.top + d.height / 2,
      });
    } else if (dstEl) {
      const d = dstEl.getBoundingClientRect();
      const x = d.left - rootRect.left + d.width / 2;
      const y = d.top - rootRect.top + d.height / 2;
      setCoords({ fromX: x, fromY: y, toX: x, toY: y });
    }
  }, [current.key]);

  useLayoutEffect(() => {
    measure();
    const t = setTimeout(measure, 350);
    return () => clearTimeout(t);
  }, [measure, done]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    if (!playing || !inView) return;
    if (finished) {
      const tRestart = setTimeout(() => {
        setSelectedGuestId("g-aarav");
        setDone(0);
      }, 3400);
      return () => clearTimeout(tRestart);
    }

    const t0 = setTimeout(() => {
      setDragPhase("source");
    }, 0);

    const tDrag = setTimeout(() => {
      setClickKey((k) => k + 1);
      setDragPhase("target");
    }, 650);

    const tComplete = setTimeout(() => {
      setClickKey((k) => k + 1);
      setDone((d) => d + 1);
      setSelectedGuestId("g-meera");
    }, 2400);

    return () => {
      clearTimeout(t0);
      clearTimeout(tDrag);
      clearTimeout(tComplete);
    };
  }, [playing, inView, finished, done]);

  const act = (k: StepKey) => {
    const idx = steps.findIndex((s) => s.key === k);
    if (idx >= 0) {
      setDone(idx + 1);
      setSelectedGuestId("g-meera");
      setClickKey((c) => c + 1);
    }
  };

  const sendServiceMessageToGuest = (guest: GuestProfileItem) => {
    const prevIdx = customMessages[guest.id]?.idx ?? -1;
    const nextIdx = (prevIdx + 1) % SERVICE_MESSAGE_TEMPLATES.length;
    setCustomMessages((prev) => ({
      ...prev,
      [guest.id]: {
        idx: nextIdx,
        text: `Hi ${guest.name.split(" ")[0]}! ${SERVICE_MESSAGE_TEMPLATES[nextIdx]}`,
      },
    }));
    setSelectedGuestId(guest.id);
    if (guest.id === "g-meera" && done < 4) {
      setDone(4);
    }
  };

  const isTarget = (k: StepKey) => !finished && current.key === k;
  const cursorX = dragPhase === "source" ? coords.fromX : coords.toX;
  const cursorY = dragPhase === "source" ? coords.fromY : coords.toY;

  return (
    <div className="grid min-w-0 gap-5 sm:gap-6 lg:grid-cols-[310px_1fr]">
      {/* Left: Guided Drag-and-Drop Step Controls */}
      <div className="min-w-0">
        <ol className="space-y-1.5">
          {steps.map((s, i) => (
            <li key={s.key}>
              <button
                type="button"
                onClick={() => {
                  setPlaying(false);
                  setDone(i);
                  if (i >= 1) setSelectedGuestId("g-meera");
                }}
                className={cn(
                  "flex w-full gap-3 rounded-xl p-3 text-left transition",
                  i === done ? "bg-white shadow-card ring-1 ring-brand-200" : "hover:bg-brand-50/60",
                )}
                aria-current={i === done ? "step" : undefined}
              >
                <span
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold",
                    i < done
                      ? "bg-brand-600 text-white"
                      : i === done
                        ? "bg-gold-400 text-brand-950"
                        : "bg-brand-100 text-brand-700",
                  )}
                >
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
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            disabled={finished}
            className="flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {playing && !finished ? (
              <>
                <Pause className="size-3.5" /> Pause
              </>
            ) : (
              <>
                <Play className="size-3.5" /> Play
              </>
            )}
          </button>
          <button
            type="button"
            aria-label="Previous step"
            onClick={() => {
              setPlaying(false);
              setDone((d) => Math.max(0, d - 1));
            }}
            className="rounded-full border border-line bg-white p-2 hover:bg-brand-50"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next step"
            onClick={() => {
              setPlaying(false);
              setClickKey((k) => k + 1);
              setDone((d) => Math.min(steps.length, d + 1));
            }}
            className="rounded-full border border-line bg-white p-2 hover:bg-brand-50"
          >
            <ChevronRight className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setCustomMessages({});
              setSelectedGuestId("g-aarav");
              setDone(0);
              setPlaying(true);
            }}
            className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-2 text-[13px] hover:bg-brand-50"
          >
            <RotateCcw className="size-3.5" /> Restart
          </button>
        </div>
      </div>

      {/* Right: Interactive Guest Directory, Profile Viewer & Service Messaging Canvas */}
      <div
        ref={boxRef}
        className="relative min-w-0 overflow-hidden rounded-2xl border border-border bg-card p-3.5 sm:p-5 text-card-foreground shadow-lift"
      >
        {/* Top Bar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[13px] sm:text-[13.5px] font-bold text-foreground">
              Grand Palace · Guest Directory, Profile &amp; Service Messaging
            </p>
            <p className="text-[11.5px] text-muted-foreground">
              Add guests, view each guest&apos;s profile &amp; room details, and send instant service messages
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-[11.5px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-emerald-500" /> Checked-In
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-brand-600" /> In-House
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-sky-500" /> Message Sent
            </span>
          </div>
        </div>

        {/* Draggable Guest Actions Palette */}
        <div className="mb-4 rounded-xl border border-brand-200/80 bg-brand-50/50 p-2.5 sm:p-3">
          <p className="mb-2 text-[11px] font-bold tracking-wider text-brand-700">
            Drag &amp; Drop Guest Actions Palette (or click to apply)
          </p>
          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-2 sm:gap-2.5 sm:grid-cols-4">
            <button
              type="button"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", "add")}
              data-crm-source="add"
              onClick={() => act("add")}
              className={cn(
                "flex items-center gap-2 rounded-xl border bg-white px-3 py-2.5 text-left text-[12px] font-semibold shadow-2xs transition",
                guestAdded
                  ? "border-emerald-300 bg-emerald-50/60 text-emerald-800"
                  : "border-brand-200 text-ink hover:border-brand-400",
                isTarget("add") && "ring-2 ring-gold-400",
              )}
            >
              <GripVertical className="size-3.5 shrink-0 text-muted-foreground" />
              <UserPlus className="size-4 shrink-0 text-brand-600" />
              <span className="truncate">{guestAdded ? "Guest Added ✓" : "+ Add: Meera Joshi"}</span>
            </button>

            <button
              type="button"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", "kyc")}
              data-crm-source="kyc"
              onClick={() => act("kyc")}
              className={cn(
                "flex items-center gap-2 rounded-xl border bg-white px-3 py-2.5 text-left text-[12px] font-semibold shadow-2xs transition",
                kycAttached
                  ? "border-emerald-300 bg-emerald-50/60 text-emerald-800"
                  : "border-brand-200 text-ink hover:border-brand-400",
                isTarget("kyc") && "ring-2 ring-gold-400",
              )}
            >
              <GripVertical className="size-3.5 shrink-0 text-muted-foreground" />
              <FileCheck2 className="size-4 shrink-0 text-emerald-600" />
              <span className="truncate">{kycAttached ? "ID & Room Saved ✓" : "ID & Room 203"}</span>
            </button>

            <button
              type="button"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", "service")}
              data-crm-source="service"
              onClick={() => act("service")}
              className={cn(
                "flex items-center gap-2 rounded-xl border bg-white px-3 py-2.5 text-left text-[12px] font-semibold shadow-2xs transition",
                serviceAdded
                  ? "border-emerald-300 bg-emerald-50/60 text-emerald-800"
                  : "border-brand-200 text-ink hover:border-brand-400",
                isTarget("service") && "ring-2 ring-gold-400",
              )}
            >
              <GripVertical className="size-3.5 shrink-0 text-muted-foreground" />
              <BellRing className="size-4 shrink-0 text-amber-600" />
              <span className="truncate">{serviceAdded ? "Service Logged ✓" : "Service: Pickup & Meal"}</span>
            </button>

            <button
              type="button"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", "message")}
              data-crm-source="message"
              onClick={() => act("message")}
              className={cn(
                "flex items-center gap-2 rounded-xl border bg-white px-3 py-2.5 text-left text-[12px] font-semibold shadow-2xs transition",
                messageSentStep
                  ? "border-emerald-300 bg-emerald-50/60 text-emerald-800"
                  : "border-brand-200 text-ink hover:border-brand-400",
                isTarget("message") && "ring-2 ring-gold-400",
              )}
            >
              <GripVertical className="size-3.5 shrink-0 text-muted-foreground" />
              <Send className="size-4 shrink-0 text-sky-600" />
              <span className="truncate">{messageSentStep ? "Message Sent ✓" : "Send Service Message"}</span>
            </button>
          </div>
        </div>

        {/* Main Guest Cards Grid + Right Selected Guest Profile & Messaging Panel */}
        <div className="grid gap-4 xl:grid-cols-[1fr_265px]">
          <div className="space-y-3.5">
            {([1, 2] as const).map((grp) => {
              const grpGuests = computedGuests.filter((g) => g.group === grp);
              return (
                <div key={grp} className="rounded-xl border border-border/70 bg-muted/20 p-3.5">
                  <div className="mb-2.5 flex items-center justify-between">
                    <span className="text-[11px] font-bold tracking-wider text-muted-foreground">
                      {grp === 1 ? "Floor 1 · Checked-In Guests" : "Floor 2 · In-House & New Guests"}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {grpGuests.filter((x) => x.messageSent).length}/{grpGuests.length} Service Messages Sent
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {grpGuests.map((g) => {
                      const m = STATUS_META[g.status];
                      const isSel = g.id === selectedGuest?.id;
                      const isMeera = g.id === "g-meera";
                      const targetAttr = isMeera
                        ? current.key === "kyc"
                          ? "kyc"
                          : current.key === "service"
                            ? "service"
                            : current.key === "message"
                              ? "message"
                              : current.key === "profile"
                                ? "profile"
                                : undefined
                        : undefined;

                      return (
                        <motion.button
                          layout
                          key={g.id}
                          type="button"
                          data-crm-target={targetAttr}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const key = e.dataTransfer.getData("text/plain") as StepKey;
                            if (key) act(key);
                          }}
                          onClick={() => {
                            if (isMeera && isTarget("profile")) {
                              act("profile");
                            } else {
                              setSelectedGuestId(g.id);
                            }
                          }}
                          initial={{ opacity: 0, scale: 0.92 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={cn(
                            "group relative flex min-h-[108px] flex-col justify-between rounded-xl border p-3.5 text-left transition",
                            isSel
                              ? "border-primary bg-card shadow-md ring-2 ring-primary/35"
                              : "border-border/80 bg-card/90 hover:border-primary/50",
                            targetAttr && isTarget(targetAttr) && "ring-2 ring-gold-400 bg-gold-50/30",
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <span className="block truncate text-[13.5px] font-bold text-foreground">
                                {g.name}
                              </span>
                              <span className="block truncate text-[11px] text-muted-foreground">
                                {g.room}
                              </span>
                            </div>
                            <span className={cn("mt-1 size-2.5 shrink-0 rounded-full", m.dot)} />
                          </div>

                          <div className="my-2 flex flex-wrap items-center gap-1.5">
                            <span
                              className={cn(
                                "rounded-full border px-2.5 py-0.5 text-[10px] font-bold",
                                m.badge,
                              )}
                            >
                              {g.status}
                            </span>
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                                g.messageSent
                                  ? "bg-sky-50 text-sky-700"
                                  : "bg-amber-50 text-amber-700",
                              )}
                            >
                              {g.messageSent ? "Msg Sent ✓" : "ID Pending"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2 text-[11px]">
                            <span className="truncate font-medium text-primary">
                              {g.serviceSummary}
                            </span>
                            <span className="shrink-0 font-mono font-semibold text-muted-foreground">
                              {inr(g.folioAmount)}
                            </span>
                          </div>
                        </motion.button>
                      );
                    })}

                    {/* Dashed Drop Slot for Adding New Guest (Meera Joshi) */}
                    {grp === 2 && !guestAdded && (
                      <button
                        type="button"
                        data-crm-target="add"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          act("add");
                        }}
                        onClick={() => act("add")}
                        className={cn(
                          "flex min-h-[108px] flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed p-3 text-center transition",
                          isTarget("add")
                            ? "border-gold-400 bg-gold-50/50 text-brand-800 ring-2 ring-gold-400/50"
                            : "border-brand-300/80 bg-brand-50/30 text-muted-foreground hover:border-brand-500",
                        )}
                      >
                        <UserPlus className="size-4 text-brand-600" />
                        <span className="text-[11.5px] font-semibold">Drop to Add New Guest</span>
                        <span className="text-[10.5px]">Meera Joshi · Room 203</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Guest Profile & Service Messaging Inspector */}
          {selectedGuest && (
            <aside className="flex flex-col justify-between rounded-xl border border-border bg-muted/20 p-4">
              <div className="space-y-3">
                {/* Guest Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 truncate text-[15.5px] font-bold text-foreground">
                      <UserRound className="size-4 shrink-0 text-primary" />
                      <span className="truncate">{selectedGuest.name}</span>
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-[11.5px] text-muted-foreground">
                      <Phone className="size-3 text-brand-600" /> {selectedGuest.phone}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold",
                      STATUS_META[selectedGuest.status].badge,
                    )}
                  >
                    {selectedGuest.status}
                  </span>
                </div>

                {/* Room & ID Profile Card */}
                <div className="rounded-lg bg-card p-3 text-[12px] shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 font-semibold text-foreground">
                      <BedDouble className="size-3.5 text-brand-600" /> {selectedGuest.room}
                    </span>
                    <span className="font-mono font-bold text-brand-700">
                      {inr(selectedGuest.folioAmount)}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Stay: {selectedGuest.stayDates} · {selectedGuest.city}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-emerald-700">
                    {selectedGuest.idDoc}
                  </p>
                </div>

                {/* Active Service Requests Card */}
                <div className="rounded-lg bg-card p-3 text-[12px] shadow-2xs">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    Guest Service Requests
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {selectedGuest.services.map((srv) => (
                      <span
                        key={srv}
                        className="rounded-md bg-brand-50 px-2 py-0.5 text-[10.5px] font-semibold text-brand-800"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Service Message Sent to Guest */}
                <div className="rounded-lg border border-sky-200/80 bg-sky-50/40 p-3 text-[11.5px] shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-900">Service Message to Guest</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-sky-700">
                      <CheckCheck className="size-3.5" /> {selectedGuest.messageSent ? "Sent" : "Ready"}
                    </span>
                  </div>
                  <p className="mt-1 leading-snug text-foreground">
                    &ldquo;{selectedGuest.lastMessage}&rdquo;
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => sendServiceMessageToGuest(selectedGuest)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-[12px] font-semibold text-white transition hover:bg-brand-700"
                >
                  <Send className="size-3.5" /> Send Service Message to Guest
                </button>
              </div>

              <p className="mt-3 flex items-center gap-1.5 border-t border-border pt-2.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="size-3.5 shrink-0 text-emerald-500" />
                Instant sync with Front Desk &amp; Room Service
              </p>
            </aside>
          )}
        </div>

        <AnimatePresence>
          {finished && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 rounded-xl bg-emerald-50 px-4 py-2.5 text-[13px] font-medium text-emerald-800"
              role="status"
            >
              Guest workflow complete — Meera Joshi is added to the directory, Room 203 &amp; ID proof are saved, and her service update message is sent.
            </motion.p>
          )}
        </AnimatePresence>

        {/* Simulated Drag-and-Drop Cursor + Floating Ghost Card */}
        {!finished && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 z-20"
            animate={{ x: cursorX - 4, y: cursorY - 2 }}
            transition={{ type: "spring", stiffness: 68, damping: 16 }}
          >
            <MousePointer2 className="size-6 fill-brand-700 text-white drop-shadow-lg" />
            <motion.span
              key={clickKey}
              className="absolute top-0 left-0 size-6 rounded-full border-2 border-gold-400"
              initial={{ scale: 0.3, opacity: 1 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
            {dragPhase === "target" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-1 ml-4 whitespace-nowrap rounded-lg border border-gold-400 bg-brand-900/95 px-2.5 py-1 text-[11px] font-semibold text-white shadow-xl"
              >
                {current.ghostLabel}
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
