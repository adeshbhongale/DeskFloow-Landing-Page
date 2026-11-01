"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  MousePointer2,
  GripVertical,
  UserPlus,
  ShieldCheck,
  Crown,
  HeartHandshake,
  FileCheck2,
  UserRound,
} from "lucide-react";
import { cn, inr } from "@/lib/utils";

const steps = [
  {
    key: "create",
    title: "Drag & drop to create Guest Profile",
    text: "Drag the new guest block for Meera Joshi from the builder palette onto the empty CRM slot.",
    ghostLabel: "+ Guest · Meera Joshi",
  },
  {
    key: "kyc",
    title: "Drop verified KYC onto Meera Joshi",
    text: "Drag Aadhaar & Passport DigiLocker KYC onto Meera's card to verify her identity.",
    ghostLabel: "✓ Aadhaar & Passport KYC",
  },
  {
    key: "tier",
    title: "Drop Platinum VIP loyalty tier",
    text: "Drag the Platinum VIP badge onto Meera's profile to unlock 3x points & suite upgrades.",
    ghostLabel: "★ Platinum VIP Tier",
  },
  {
    key: "prefs",
    title: "Drop dietary & occasion preferences",
    text: "Attach Jain Diet, Memory Pillow & Anniversary setup alerts to sync with Kitchen POS.",
    ghostLabel: "♥ Jain Diet & Anniversary",
  },
  {
    key: "inspect",
    title: "Inspect 360° guest info & folio spend",
    text: "Click Meera Joshi's card to inspect her KYC vault, stay history, and lifetime spend.",
    ghostLabel: "Inspect 360° Guest Info",
  },
] as const;

type StepKey = (typeof steps)[number]["key"];
type VipTier = "Member" | "Silver" | "Gold" | "Platinum VIP";

interface GuestProfileItem {
  id: string;
  group: 1 | 2;
  name: string;
  city: string;
  phone: string;
  tier: VipTier;
  points: number;
  stays: number;
  lifetimeSpend: number;
  kycVerified: boolean;
  kycDoc: string;
  companion: string;
  lastRoom: string;
  primaryNote: string;
  preferences: string[];
}

const BASE_GUESTS: GuestProfileItem[] = [
  {
    id: "g-aarav",
    group: 1,
    name: "Aarav Mehta",
    city: "Mumbai",
    phone: "+91 98201 44110",
    tier: "Gold",
    points: 8420,
    stays: 4,
    lifetimeSpend: 68400,
    kycVerified: true,
    kycDoc: "Aadhaar ···· 7392 (Verified)",
    companion: "Neha Mehta · Spouse",
    lastRoom: "Room 101 · Standard",
    primaryNote: "High Floor · Early Check-In",
    preferences: ["High Floor", "Early Check-In", "Black Coffee"],
  },
  {
    id: "g-ananya",
    group: 1,
    name: "Ananya Iyer",
    city: "Bengaluru",
    phone: "+91 98840 12093",
    tier: "Platinum VIP",
    points: 12950,
    stays: 5,
    lifetimeSpend: 118600,
    kycVerified: true,
    kycDoc: "Passport #K9042118 (Verified)",
    companion: "Solo Corporate Guest",
    lastRoom: "Room 201 · Premium",
    primaryNote: "Quiet Wing · Airport Sedan",
    preferences: ["Quiet Wing", "Hypoallergenic Pillow", "Airport Sedan"],
  },
  {
    id: "g-vikram",
    group: 1,
    name: "Vikram Singh",
    city: "Udaipur",
    phone: "+91 98112 77804",
    tier: "Gold",
    points: 6890,
    stays: 3,
    lifetimeSpend: 54000,
    kycVerified: true,
    kycDoc: "Aadhaar ···· 5510 (Verified)",
    companion: "Family (2 Adults, 1 Child)",
    lastRoom: "Room 104 · Deluxe",
    primaryNote: "King Bed · Extra Rollaway",
    preferences: ["King Bed", "Extra Rollaway", "Late Checkout"],
  },
  {
    id: "g-kabir",
    group: 2,
    name: "Kabir Sharma",
    city: "New Delhi",
    phone: "+91 90080 33218",
    tier: "Silver",
    points: 4100,
    stays: 2,
    lifetimeSpend: 31200,
    kycVerified: true,
    kycDoc: "Aadhaar ···· 2190 (Verified)",
    companion: "Rhea Sharma · Spouse",
    lastRoom: "Room 204 · Deluxe",
    primaryNote: "Pool View · Late Check-Out",
    preferences: ["Pool View", "Late Check-Out 1 PM", "Extra Towels"],
  },
  {
    id: "g-james",
    group: 2,
    name: "James Carter",
    city: "London",
    phone: "+44 7700 900412",
    tier: "Silver",
    points: 3650,
    stays: 2,
    lifetimeSpend: 42800,
    kycVerified: true,
    kycDoc: "UK Passport #P449102",
    companion: "Emily Carter · Spouse",
    lastRoom: "Room 202 · Premium",
    primaryNote: "Vegan Breakfast · Heritage Tour",
    preferences: ["Vegan Breakfast", "Airport Transfer", "Quiet Room"],
  },
];

const TIER_META: Record<VipTier, { badge: string; dot: string }> = {
  "Platinum VIP": {
    badge: "bg-brand-900 text-gold-300 border-gold-400/50",
    dot: "bg-brand-700",
  },
  Gold: {
    badge: "bg-amber-100 text-amber-900 border-amber-300",
    dot: "bg-amber-500",
  },
  Silver: {
    badge: "bg-slate-100 text-slate-800 border-slate-300",
    dot: "bg-slate-400",
  },
  Member: {
    badge: "bg-brand-50 text-brand-700 border-brand-200",
    dot: "bg-emerald-500",
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
  const [selectedGuestId, setSelectedGuestId] = useState("g-ananya");
  const [manualTierOverrides, setManualTierOverrides] = useState<Record<string, VipTier>>({});

  const boxRef = useRef<HTMLDivElement>(null);
  const inView = useInView(boxRef, { amount: 0.15 });

  const finished = done >= steps.length;
  const current = steps[Math.min(done, steps.length - 1)];

  const guestCreated = done >= 1;
  const kycVerified = done >= 2;
  const vipUpgraded = done >= 3;
  const prefsAdded = done >= 4;

  const meeraProfile: GuestProfileItem = {
    id: "g-meera",
    group: 2,
    name: "Meera Joshi",
    city: "Jaipur",
    phone: "+91 98230 55401",
    tier: manualTierOverrides["g-meera"] ?? (vipUpgraded ? "Platinum VIP" : "Member"),
    points: vipUpgraded ? 14820 : 1200,
    stays: vipUpgraded ? 6 : 1,
    lifetimeSpend: vipUpgraded ? 142500 : 23000,
    kycVerified,
    kycDoc: kycVerified ? "Aadhaar ···· 4821 & Passport ✓" : "KYC Pending Upload",
    companion: prefsAdded ? "Rohan Joshi · Anniversary 12 Nov" : "Rohan Joshi · Spouse",
    lastRoom: "Suite 203 · Royal Suite",
    primaryNote: prefsAdded
      ? "Jain Diet · Memory Pillow · Anniv."
      : kycVerified
        ? "KYC Verified ✓ · Suite 203"
        : "New Profile · Suite 203",
    preferences: prefsAdded
      ? ["Jain Vegetarian", "Memory Foam Pillow", "21°C AC", "Anniversary Setup"]
      : ["Direct Booking", "Suite 203"],
  };

  const computedGuests: GuestProfileItem[] = [
    ...BASE_GUESTS.map((g) => ({
      ...g,
      tier: manualTierOverrides[g.id] ?? g.tier,
    })),
    ...(guestCreated ? [meeraProfile] : []),
  ];

  const activeGuestId = guestCreated ? "g-meera" : selectedGuestId;
  const selectedGuest =
    computedGuests.find((g) => g.id === (guestCreated && selectedGuestId === "g-ananya" ? "g-meera" : selectedGuestId)) ??
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
        setSelectedGuestId("g-ananya");
        setDone(0);
      }, 3200);
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

  const cycleGuestTier = (guestId: string, currentTier: VipTier) => {
    const order: VipTier[] = ["Member", "Silver", "Gold", "Platinum VIP"];
    const next = order[(order.indexOf(currentTier) + 1) % order.length];
    setManualTierOverrides((prev) => ({ ...prev, [guestId]: next }));
    setSelectedGuestId(guestId);
  };

  const isTarget = (k: StepKey) => !finished && current.key === k;
  const cursorX = dragPhase === "source" ? coords.fromX : coords.toX;
  const cursorY = dragPhase === "source" ? coords.fromY : coords.toY;

  return (
    <div className="grid gap-6 lg:grid-cols-[310px_1fr]">
      {/* Left: Guided Drag-and-Drop Step Controls (exact match with Visual Floor Plan) */}
      <div>
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
              setManualTierOverrides({});
              setSelectedGuestId("g-ananya");
              setDone(0);
              setPlaying(true);
            }}
            className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-2 text-[13px] hover:bg-brand-50"
          >
            <RotateCcw className="size-3.5" /> Restart
          </button>
        </div>
      </div>

      {/* Right: Interactive Drag-and-Drop Guest CRM Canvas (exact layout match with FloorPlan) */}
      <div
        ref={boxRef}
        className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-lift"
      >
        {/* Top Bar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[13.5px] font-bold text-foreground">
              Grand Palace · 360° Guest CRM &amp; Loyalty Directory
            </p>
            <p className="text-[11.5px] text-muted-foreground">
              Drag &amp; drop blocks to create guests, verify KYC, upgrade VIP tiers, or inspect guest info
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11.5px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-brand-700" /> Platinum VIP
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-amber-500" /> Gold Tier
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-emerald-500" /> KYC Verified
            </span>
          </div>
        </div>

        {/* Draggable Guest CRM Builder Palette */}
        <div className="mb-4 rounded-xl border border-brand-200/80 bg-brand-50/50 p-3">
          <p className="mb-2 text-[11px] font-bold tracking-wider text-brand-700 uppercase">
            Drag &amp; Drop Guest CRM Palette (or click to apply)
          </p>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <button
              type="button"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", "create")}
              data-crm-source="create"
              onClick={() => act("create")}
              className={cn(
                "flex items-center gap-2 rounded-xl border bg-white px-3 py-2.5 text-left text-[12px] font-semibold shadow-2xs transition",
                guestCreated
                  ? "border-emerald-300 bg-emerald-50/60 text-emerald-800"
                  : "border-brand-200 text-ink hover:border-brand-400",
                isTarget("create") && "ring-2 ring-gold-400",
              )}
            >
              <GripVertical className="size-3.5 shrink-0 text-muted-foreground" />
              <UserPlus className="size-4 shrink-0 text-brand-600" />
              <span className="truncate">{guestCreated ? "Meera Created ✓" : "+ Guest: Meera Joshi"}</span>
            </button>

            <button
              type="button"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", "kyc")}
              data-crm-source="kyc"
              onClick={() => act("kyc")}
              className={cn(
                "flex items-center gap-2 rounded-xl border bg-white px-3 py-2.5 text-left text-[12px] font-semibold shadow-2xs transition",
                kycVerified
                  ? "border-emerald-300 bg-emerald-50/60 text-emerald-800"
                  : "border-brand-200 text-ink hover:border-brand-400",
                isTarget("kyc") && "ring-2 ring-gold-400",
              )}
            >
              <GripVertical className="size-3.5 shrink-0 text-muted-foreground" />
              <FileCheck2 className="size-4 shrink-0 text-emerald-600" />
              <span className="truncate">{kycVerified ? "KYC Verified ✓" : "KYC: Aadhaar & ID"}</span>
            </button>

            <button
              type="button"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", "tier")}
              data-crm-source="tier"
              onClick={() => act("tier")}
              className={cn(
                "flex items-center gap-2 rounded-xl border bg-white px-3 py-2.5 text-left text-[12px] font-semibold shadow-2xs transition",
                vipUpgraded
                  ? "border-emerald-300 bg-emerald-50/60 text-emerald-800"
                  : "border-brand-200 text-ink hover:border-brand-400",
                isTarget("tier") && "ring-2 ring-gold-400",
              )}
            >
              <GripVertical className="size-3.5 shrink-0 text-muted-foreground" />
              <Crown className="size-4 shrink-0 text-amber-600" />
              <span className="truncate">{vipUpgraded ? "Platinum VIP ✓" : "Tier: Platinum VIP"}</span>
            </button>

            <button
              type="button"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", "prefs")}
              data-crm-source="prefs"
              onClick={() => act("prefs")}
              className={cn(
                "flex items-center gap-2 rounded-xl border bg-white px-3 py-2.5 text-left text-[12px] font-semibold shadow-2xs transition",
                prefsAdded
                  ? "border-emerald-300 bg-emerald-50/60 text-emerald-800"
                  : "border-brand-200 text-ink hover:border-brand-400",
                isTarget("prefs") && "ring-2 ring-gold-400",
              )}
            >
              <GripVertical className="size-3.5 shrink-0 text-muted-foreground" />
              <HeartHandshake className="size-4 shrink-0 text-rose-600" />
              <span className="truncate">{prefsAdded ? "Prefs Saved ✓" : "Prefs: Jain & Anniv."}</span>
            </button>
          </div>
        </div>

        {/* Main Grid + Selected Guest Inspector (same structure & spacing as FloorPlan) */}
        <div className="grid gap-4 xl:grid-cols-[1fr_255px]">
          <div className="space-y-3.5">
            {([1, 2] as const).map((grp) => {
              const grpGuests = computedGuests.filter((g) => g.group === grp);
              return (
                <div key={grp} className="rounded-xl border border-border/70 bg-muted/20 p-3.5">
                  <div className="mb-2.5 flex items-center justify-between">
                    <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                      {grp === 1 ? "Returning VIP & Loyalty Members" : "In-House & New Guest Profiles"}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {grpGuests.filter((x) => x.kycVerified).length}/{grpGuests.length} KYC Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {grpGuests.map((g) => {
                      const m = TIER_META[g.tier];
                      const isSel = g.id === selectedGuest?.id;
                      const isMeera = g.id === "g-meera";
                      const targetAttr = isMeera
                        ? current.key === "kyc"
                          ? "kyc"
                          : current.key === "tier"
                            ? "tier"
                            : current.key === "prefs"
                              ? "prefs"
                              : current.key === "inspect"
                                ? "inspect"
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
                            if (isMeera && isTarget("inspect")) {
                              act("inspect");
                            } else {
                              setSelectedGuestId(g.id);
                            }
                          }}
                          initial={{ opacity: 0, scale: 0.92 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={cn(
                            "group relative flex min-h-[104px] flex-col justify-between rounded-xl border p-3.5 text-left transition",
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
                                {g.city} · {g.stays} {g.stays === 1 ? "Stay" : "Stays"}
                              </span>
                            </div>
                            <span className={cn("mt-1 size-2.5 shrink-0 rounded-full", m.dot)} />
                          </div>

                          <div className="my-2 flex flex-wrap items-center gap-1.5">
                            <span
                              className={cn(
                                "rounded-full border px-2.5 py-0.5 text-[10.5px] font-bold",
                                m.badge,
                              )}
                            >
                              {g.tier}
                            </span>
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                                g.kycVerified
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-amber-50 text-amber-700",
                              )}
                            >
                              {g.kycVerified ? "KYC ✓" : "KYC Pending"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2 text-[11px]">
                            <span className="truncate font-medium text-primary">
                              {g.primaryNote}
                            </span>
                            <span className="shrink-0 font-mono font-semibold text-muted-foreground">
                              {inr(g.lifetimeSpend)}
                            </span>
                          </div>
                        </motion.button>
                      );
                    })}

                    {/* Dashed Drop Slot for Creating New Guest (Meera Joshi) */}
                    {grp === 2 && !guestCreated && (
                      <button
                        type="button"
                        data-crm-target="create"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          act("create");
                        }}
                        onClick={() => act("create")}
                        className={cn(
                          "flex min-h-[104px] flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed p-3 text-center transition",
                          isTarget("create")
                            ? "border-gold-400 bg-gold-50/50 text-brand-800 ring-2 ring-gold-400/50"
                            : "border-brand-300/80 bg-brand-50/30 text-muted-foreground hover:border-brand-500",
                        )}
                      >
                        <UserPlus className="size-4 text-brand-600" />
                        <span className="text-[11.5px] font-semibold">Drop to Create Guest</span>
                        <span className="text-[10.5px]">Meera Joshi · Suite 203</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right 360° Guest Info Inspector Panel (same clean proportions as FloorPlan) */}
          {selectedGuest && (
            <aside className="flex flex-col justify-between rounded-xl border border-border bg-muted/20 p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 truncate text-[15.5px] font-bold text-foreground">
                      <UserRound className="size-4 shrink-0 text-primary" />
                      <span className="truncate">{selectedGuest.name}</span>
                    </p>
                    <p className="truncate text-[11.5px] text-muted-foreground">
                      {selectedGuest.city} · {selectedGuest.phone}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold",
                      TIER_META[selectedGuest.tier].badge,
                    )}
                  >
                    {selectedGuest.tier}
                  </span>
                </div>

                <div className="rounded-lg bg-card p-3 text-[12px] shadow-2xs">
                  <p className="text-muted-foreground">Lifetime Spend &amp; Loyalty</p>
                  <p className="mt-0.5 text-[15px] font-bold text-foreground">
                    {inr(selectedGuest.lifetimeSpend)}{" "}
                    <span className="text-[11.5px] font-semibold text-brand-700">
                      · {selectedGuest.points.toLocaleString("en-IN")} pts
                    </span>
                  </p>
                </div>

                <div className="rounded-lg bg-card p-3 text-[12px] shadow-2xs">
                  <p className="text-muted-foreground">KYC &amp; Companion Vault</p>
                  <p className="mt-0.5 font-semibold text-foreground">{selectedGuest.kycDoc}</p>
                  <p className="mt-1 text-[11.5px] font-medium text-brand-700">
                    {selectedGuest.companion}
                  </p>
                </div>

                <div className="rounded-lg bg-card p-3 text-[12px] shadow-2xs">
                  <p className="text-muted-foreground">Dietary &amp; Stay Preferences</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {selectedGuest.preferences.map((pref) => (
                      <span
                        key={pref}
                        className="rounded-md bg-brand-50 px-2 py-0.5 text-[10.5px] font-semibold text-brand-800"
                      >
                        {pref}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => cycleGuestTier(selectedGuest.id, selectedGuest.tier)}
                  className="w-full rounded-lg bg-brand-600 px-3 py-2 text-[12px] font-semibold text-white transition hover:bg-brand-700"
                >
                  Cycle VIP Loyalty Tier
                </button>
              </div>

              <p className="mt-3 flex items-center gap-1.5 border-t border-border pt-2.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="size-3.5 shrink-0 text-emerald-500" />
                Live sync with Front Desk &amp; Kitchen POS
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
              Guest CRM workflow complete — Meera Joshi&apos;s 360° profile is created, KYC verified, upgraded to Platinum VIP, and synced with Kitchen POS &amp; Front Desk.
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
