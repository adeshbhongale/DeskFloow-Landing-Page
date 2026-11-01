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
  PlusSquare,
  UserRound,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  BedDouble,
} from "lucide-react";
import { HkBadge, hkMeta } from "@/components/ui/badges";
import { cn, inr } from "@/lib/utils";
import type { HousekeepingStatus, RoomCategory } from "@/types";

const steps = [
  {
    key: "create",
    title: "Drag & drop to create Room 205",
    text: "Drag the new Suite 205 block from the builder palette onto the empty floor slot.",
    ghostLabel: "+ Room 205 · Royal Suite",
  },
  {
    key: "guest",
    title: "Drag VIP guest onto Room 203",
    text: "Drop arriving guest Meera Joshi (RSV-1048) onto Suite 203 to assign her room.",
    ghostLabel: "Meera Joshi · RSV-1048",
  },
  {
    key: "staff",
    title: "Drop housekeeper onto Dirty Room 103",
    text: "Drag attendant Priya S. onto dirty Room 103 to start express cleaning.",
    ghostLabel: "Priya S. → Room 103",
  },
  {
    key: "clean",
    title: "Drop 'Clean & Ready' onto Room 204",
    text: "Drag the Clean & Inspected badge onto Room 204 to unlock front-desk check-in.",
    ghostLabel: "✓ Clean & Inspected",
  },
  {
    key: "sync",
    title: "Inspect Room 205 & live PMS sync",
    text: "Click newly created Room 205 to verify instant Tape Chart & Front Desk sync.",
    ghostLabel: "Inspect Room 205",
  },
] as const;

type StepKey = (typeof steps)[number]["key"];

interface FloorRoomItem {
  number: string;
  floor: number;
  category: RoomCategory;
  rate: number;
  housekeeping: HousekeepingStatus;
  occupant?: string;
  attendant?: string;
  span?: number;
}

const BASE_ROOMS: FloorRoomItem[] = [
  { number: "101", floor: 1, category: "Standard", rate: 3800, housekeeping: "clean", occupant: "Aarav Mehta" },
  { number: "102", floor: 1, category: "Standard", rate: 3800, housekeeping: "clean" },
  { number: "103", floor: 1, category: "Deluxe", rate: 5200, housekeeping: "dirty" },
  { number: "104", floor: 1, category: "Deluxe", rate: 5200, housekeeping: "clean", occupant: "Vikram Singh" },
  { number: "201", floor: 2, category: "Premium", rate: 6900, housekeeping: "clean", occupant: "Ananya Iyer" },
  { number: "202", floor: 2, category: "Premium", rate: 6900, housekeeping: "clean", occupant: "James Carter" },
  { number: "203", floor: 2, category: "Suite", rate: 11500, housekeeping: "clean" },
  { number: "204", floor: 2, category: "Deluxe", rate: 5200, housekeeping: "cleaning", attendant: "Ramesh K." },
];

export function FloorPlan() {
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
  const [selectedRoomNum, setSelectedRoomNum] = useState("203");
  const [manualStatusOverrides, setManualStatusOverrides] = useState<Record<string, HousekeepingStatus>>({});

  const boxRef = useRef<HTMLDivElement>(null);
  const inView = useInView(boxRef, { amount: 0.15 });

  const finished = done >= steps.length;
  const current = steps[Math.min(done, steps.length - 1)];

  // Derive live floor plan state from completed tour steps + any manual status toggles
  const room205Created = done >= 1;
  const guestAssigned203 = done >= 2;
  const staffAssigned103 = done >= 3;
  const room204Clean = done >= 4;

  const computedRooms: FloorRoomItem[] = [
    ...BASE_ROOMS.map((r) => {
      let hk = r.housekeeping;
      let occ = r.occupant;
      let att = r.attendant;

      if (r.number === "203" && guestAssigned203) {
        occ = "Meera Joshi (VIP)";
      }
      if (r.number === "103" && staffAssigned103) {
        hk = "cleaning";
        att = "Priya S.";
      }
      if (r.number === "204" && room204Clean) {
        hk = "clean";
        att = "Inspected ✓";
      }
      if (manualStatusOverrides[r.number]) {
        hk = manualStatusOverrides[r.number];
      }
      return { ...r, housekeeping: hk, occupant: occ, attendant: att };
    }),
    ...(room205Created
      ? [
          {
            number: "205",
            floor: 2,
            category: "Suite" as RoomCategory,
            rate: 11500,
            housekeeping: manualStatusOverrides["205"] ?? ("clean" as HousekeepingStatus),
            occupant: done >= 5 ? "Ready for Arrival" : undefined,
            attendant: "New Block Created",
          },
        ]
      : []),
  ];

  const activeRoomNum = done >= 5 ? "205" : done === 3 ? "204" : done === 2 ? "103" : selectedRoomNum;
  const selectedRoom = computedRooms.find((r) => r.number === activeRoomNum) ?? computedRooms[0];

  const measure = useCallback(() => {
    const root = boxRef.current;
    if (!root) return;
    const srcEl = root.querySelector(`[data-fp-source="${current.key}"]`);
    const dstEl = root.querySelector(`[data-fp-target="${current.key}"]`);
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
      const tRestart = setTimeout(() => setDone(0), 3200);
      return () => clearTimeout(tRestart);
    }

    const t0 = setTimeout(() => {
      setDragPhase("source");
    }, 0);

    // Move cursor to source first, then drag to target, then complete step
    const tDrag = setTimeout(() => {
      setClickKey((k) => k + 1);
      setDragPhase("target");
    }, 650);

    const tComplete = setTimeout(() => {
      setClickKey((k) => k + 1);
      setDone((d) => d + 1);
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
      setClickKey((c) => c + 1);
    }
  };

  const cycleRoomStatus = (num: string, currentHk: HousekeepingStatus) => {
    const order: HousekeepingStatus[] = ["dirty", "cleaning", "clean"];
    const next = order[(order.indexOf(currentHk) + 1) % order.length];
    setManualStatusOverrides((prev) => ({ ...prev, [num]: next }));
    setSelectedRoomNum(num);
  };

  const isTarget = (k: StepKey) => !finished && current.key === k;
  const cursorX = dragPhase === "source" ? coords.fromX : coords.toX;
  const cursorY = dragPhase === "source" ? coords.fromY : coords.toY;

  return (
    <div className="grid min-w-0 gap-5 sm:gap-6 lg:grid-cols-[310px_1fr]">
      {/* Left: Guided Drag-and-Drop Step Controls (same pattern as Guided Product Tour) */}
      <div className="min-w-0">
        <ol className="space-y-1.5">
          {steps.map((s, i) => (
            <li key={s.key}>
              <button
                type="button"
                onClick={() => {
                  setPlaying(false);
                  setDone(i);
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
              setManualStatusOverrides({});
              setDone(0);
              setPlaying(true);
            }}
            className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-2 text-[13px] hover:bg-brand-50"
          >
            <RotateCcw className="size-3.5" /> Restart
          </button>
        </div>
      </div>

      {/* Right: Interactive Drag-and-Drop Floor Plan Canvas */}
      <div
        ref={boxRef}
        className="relative min-w-0 overflow-hidden rounded-2xl border border-border bg-card p-3 sm:p-4 text-card-foreground shadow-lift"
      >
        {/* Top Bar */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[13px] sm:text-[13.5px] font-bold text-foreground">
              Grand Palace · Visual Floor Plan Builder &amp; Housekeeping
            </p>
            <p className="text-[11.5px] text-muted-foreground">
              Drag &amp; drop blocks to create rooms, assign guests, or update housekeeping status
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-[11.5px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-emerald-500" /> Clean
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-amber-500" /> Cleaning
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-rose-500" /> Dirty
            </span>
          </div>
        </div>

        {/* Draggable Creation & Housekeeping Palette */}
        <div className="mb-4 rounded-xl border border-brand-200/80 bg-brand-50/50 p-2.5">
          <p className="mb-2 text-[11px] font-bold tracking-wider text-brand-700 uppercase">
            Drag &amp; Drop Builder Palette (or click to apply)
          </p>
          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-2 sm:grid-cols-4">
            <button
              type="button"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", "create")}
              data-fp-source="create"
              onClick={() => act("create")}
              className={cn(
                "flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-left text-[12px] font-semibold shadow-2xs transition",
                room205Created
                  ? "border-emerald-300 bg-emerald-50/60 text-emerald-800"
                  : "border-brand-200 text-ink hover:border-brand-400",
                isTarget("create") && "ring-2 ring-gold-400",
              )}
            >
              <GripVertical className="size-3.5 shrink-0 text-muted-foreground" />
              <PlusSquare className="size-4 shrink-0 text-brand-600" />
              <span className="truncate">{room205Created ? "Room 205 Created ✓" : "+ Room 205 · Suite"}</span>
            </button>

            <button
              type="button"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", "guest")}
              data-fp-source="guest"
              onClick={() => act("guest")}
              className={cn(
                "flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-left text-[12px] font-semibold shadow-2xs transition",
                guestAssigned203
                  ? "border-emerald-300 bg-emerald-50/60 text-emerald-800"
                  : "border-brand-200 text-ink hover:border-brand-400",
                isTarget("guest") && "ring-2 ring-gold-400",
              )}
            >
              <GripVertical className="size-3.5 shrink-0 text-muted-foreground" />
              <UserRound className="size-4 shrink-0 text-brand-600" />
              <span className="truncate">{guestAssigned203 ? "Meera Assigned ✓" : "VIP: Meera Joshi"}</span>
            </button>

            <button
              type="button"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", "staff")}
              data-fp-source="staff"
              onClick={() => act("staff")}
              className={cn(
                "flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-left text-[12px] font-semibold shadow-2xs transition",
                staffAssigned103
                  ? "border-emerald-300 bg-emerald-50/60 text-emerald-800"
                  : "border-brand-200 text-ink hover:border-brand-400",
                isTarget("staff") && "ring-2 ring-gold-400",
              )}
            >
              <GripVertical className="size-3.5 shrink-0 text-muted-foreground" />
              <Sparkles className="size-4 shrink-0 text-amber-600" />
              <span className="truncate">{staffAssigned103 ? "Priya S. Assigned ✓" : "Staff: Priya S."}</span>
            </button>

            <button
              type="button"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", "clean")}
              data-fp-source="clean"
              onClick={() => act("clean")}
              className={cn(
                "flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-left text-[12px] font-semibold shadow-2xs transition",
                room204Clean
                  ? "border-emerald-300 bg-emerald-50/60 text-emerald-800"
                  : "border-brand-200 text-ink hover:border-brand-400",
                isTarget("clean") && "ring-2 ring-gold-400",
              )}
            >
              <GripVertical className="size-3.5 shrink-0 text-muted-foreground" />
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
              <span className="truncate">{room204Clean ? "204 Marked Clean ✓" : "Badge: Clean & Ready"}</span>
            </button>
          </div>
        </div>

        {/* Main Grid + Selected Room Inspector */}
        <div className="grid gap-4 xl:grid-cols-[1fr_240px]">
          <div className="space-y-3">
            {[1, 2].map((fl) => {
              const flRooms = computedRooms.filter((r) => r.floor === fl);
              return (
                <div key={fl} className="rounded-xl border border-border/70 bg-muted/20 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                      Floor {fl} Layout
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {flRooms.filter((x) => x.housekeeping === "clean").length}/{flRooms.length} Clean
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                    {flRooms.map((r) => {
                      const m = hkMeta[r.housekeeping];
                      const isSel = r.number === selectedRoom?.number;
                      const targetAttr =
                        r.number === "203"
                          ? "guest"
                          : r.number === "103"
                            ? "staff"
                            : r.number === "204"
                              ? "clean"
                              : r.number === "205"
                                ? "sync"
                                : undefined;

                      return (
                        <motion.button
                          layout
                          key={r.number}
                          type="button"
                          data-fp-target={targetAttr}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const key = e.dataTransfer.getData("text/plain") as StepKey;
                            if (key) act(key);
                          }}
                          onClick={() => {
                            if (r.number === "205" && isTarget("sync")) {
                              act("sync");
                            } else {
                              cycleRoomStatus(r.number, r.housekeeping);
                            }
                          }}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={cn(
                            "group relative flex min-h-[86px] flex-col justify-between rounded-xl border p-2.5 text-left transition",
                            isSel
                              ? "border-primary bg-card shadow-md ring-2 ring-primary/35"
                              : "border-border/80 bg-card/90 hover:border-primary/50",
                            targetAttr && isTarget(targetAttr) && "ring-2 ring-gold-400 bg-gold-50/30",
                          )}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <div>
                              <span className="text-[13.5px] font-bold text-foreground">{r.number}</span>
                              <span className="ml-1 text-[10.5px] text-muted-foreground">· {r.category}</span>
                            </div>
                            <span className={cn("mt-1 size-2.5 shrink-0 rounded-full", m.dot)} />
                          </div>

                          <div className="my-1">
                            <HkBadge status={r.housekeeping} />
                          </div>

                          <div className="flex items-center justify-between text-[10.5px]">
                            <span className="truncate font-medium text-primary">
                              {r.occupant ?? r.attendant ?? "Vacant"}
                            </span>
                            <span className="font-mono text-muted-foreground">{inr(r.rate)}</span>
                          </div>
                        </motion.button>
                      );
                    })}

                    {/* Dashed Drop Slot for Creating Room 205 on Floor 2 */}
                    {fl === 2 && !room205Created && (
                      <button
                        type="button"
                        data-fp-target="create"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          act("create");
                        }}
                        onClick={() => act("create")}
                        className={cn(
                          "flex min-h-[86px] flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed p-2 text-center transition",
                          isTarget("create")
                            ? "border-gold-400 bg-gold-50/50 text-brand-800 ring-2 ring-gold-400/50"
                            : "border-brand-300/80 bg-brand-50/30 text-muted-foreground hover:border-brand-500",
                        )}
                      >
                        <PlusSquare className="size-4 text-brand-600" />
                        <span className="text-[11px] font-semibold">Drop to Create</span>
                        <span className="text-[10px]">Room 205 · Suite</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Inspector Panel */}
          {selectedRoom && (
            <aside className="flex flex-col justify-between rounded-xl border border-border bg-muted/20 p-3.5">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className=" flex items-center gap-1.5 text-[16px] font-bold text-foreground">
                      <BedDouble className="size-4 text-primary" /> Room {selectedRoom.number}
                    </p>
                    <p className="text-[12px] text-muted-foreground">
                      Floor {selectedRoom.floor} · {selectedRoom.category}
                    </p>
                  </div>
                  <HkBadge status={selectedRoom.housekeeping} />
                </div>

                <div className="rounded-lg bg-card p-2.5 text-[12px] shadow-2xs">
                  <p className="text-muted-foreground">Nightly Rate</p>
                  <p className="text-[15px] font-bold text-foreground">{inr(selectedRoom.rate)}</p>
                </div>

                <div className="rounded-lg bg-card p-2.5 text-[12px] shadow-2xs">
                  <p className="text-muted-foreground">Assignment &amp; Notes</p>
                  <p className="mt-0.5 font-semibold text-foreground">
                    {selectedRoom.occupant ?? "Vacant · Ready for assignment"}
                  </p>
                  {selectedRoom.attendant && (
                    <p className="mt-1 text-[11.5px] font-medium text-brand-700">
                      Housekeeping: {selectedRoom.attendant}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => cycleRoomStatus(selectedRoom.number, selectedRoom.housekeeping)}
                  className="w-full rounded-lg bg-brand-600 px-3 py-2 text-[12px] font-semibold text-white transition hover:bg-brand-700"
                >
                  Cycle Housekeeping Status
                </button>
              </div>

              <p className="mt-3 flex items-center gap-1.5 border-t border-border pt-2.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="size-3.5 shrink-0 text-emerald-500" />
                Live sync with Tape Chart &amp; Check-in Guard
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
              Floor plan workflow complete — Room 205 is created, VIP guest Meera Joshi is assigned, and housekeeping statuses are synced across DeskFloow.
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
