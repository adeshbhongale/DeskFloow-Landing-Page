"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, Ban } from "lucide-react";
import { format, parseISO } from "date-fns";
import { HkBadge, resMeta } from "@/components/ui/badges";
import { demoRooms } from "@/data/demo-properties";
import { demoReservations } from "@/data/demo-reservations";
import { guestOf } from "@/data/demo-guests";
import { DEMO_TODAY, nightsBetween, shiftIso, shortDate, weekFrom } from "@/lib/dates";
import { cn } from "@/lib/utils";
import type { RoomCategory } from "@/types";

export function TapeChart() {
  const rooms = demoRooms.filter((r) => r.propertyId === "grand-palace");
  const reservations = demoReservations.filter((r) => r.propertyId === "grand-palace");

  const [start, setStart] = useState(shiftIso(DEMO_TODAY, -1));
  const [category, setCategory] = useState<RoomCategory | "All">("All");

  const days = weekFrom(start);
  const end = shiftIso(start, 7);

  const categories = useMemo(
    () => ["All", ...new Set(rooms.map((r) => r.category))] as (RoomCategory | "All")[],
    [rooms],
  );
  const visibleRooms = rooms.filter((r) => category === "All" || r.category === category);
  const floors = [...new Set(visibleRooms.map((r) => r.floor))].sort();

  return (
    <div className="card min-w-0 max-w-full overflow-hidden">
      {/* Tape Chart Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 border-b border-border bg-card/60 p-3">
        <div className="flex items-center gap-1.5">
          <button
            aria-label="Previous week"
            onClick={() => setStart(shiftIso(start, -7))}
            className="rounded-lg border border-border p-1.5 hover:bg-accent"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={() => setStart(shiftIso(DEMO_TODAY, -1))}
            className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-[12px] sm:text-[12.5px] font-medium hover:bg-accent"
          >
            <CalendarDays className="size-3.5 text-primary" /> Today
          </button>
          <button
            aria-label="Next week"
            onClick={() => setStart(shiftIso(start, 7))}
            className="rounded-lg border border-border p-1.5 hover:bg-accent"
          >
            <ChevronRight className="size-4" />
          </button>
          <span className="ml-1.5 sm:ml-2 text-[12px] sm:text-[13px] font-semibold">
            {shortDate(start)} – {shortDate(shiftIso(end, -1))}
          </span>
        </div>

        {/* Category Filters */}
        <div className="flex max-w-full gap-1 overflow-x-auto no-scrollbar sm:flex-wrap" role="group" aria-label="Filter by room category">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-[12px] font-medium transition",
                category === c
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto scrollbar-thin">
        <div className="min-w-[820px]">
          {/* Header row */}
          <div className="grid grid-cols-[120px_repeat(7,minmax(96px,1fr))] border-b border-border bg-muted/40 text-[12px]">
            <div className="px-3 py-2.5 font-medium text-muted-foreground">Room</div>
            {days.map((d) => (
              <div
                key={d}
                className={cn(
                  "border-l border-border px-2 py-2 text-center",
                  d === DEMO_TODAY && "bg-primary/10 font-bold text-primary",
                )}
              >
                <span className="block font-semibold">{format(parseISO(d), "EEE")}</span>
                <span className="text-[11px] text-muted-foreground">{format(parseISO(d), "d MMM")}</span>
              </div>
            ))}
          </div>

          {/* Room rows by floor */}
          {floors.map((floor) => (
            <div key={floor}>
              <div className="border-b border-border/60 bg-muted/20 px-3 py-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Floor {floor}
              </div>
              {visibleRooms
                .filter((r) => r.floor === floor)
                .map((room) => {
                  const rowRes = reservations.filter(
                    (r) =>
                      r.roomId === room.id &&
                      r.status !== "cancelled" &&
                      r.checkIn < end &&
                      r.checkOut > start,
                  );

                  return (
                    <div
                      key={room.id}
                      className="grid grid-cols-[120px_repeat(7,minmax(96px,1fr))] border-b border-border/60 transition-colors hover:bg-muted/10"
                    >
                      <div className="flex flex-col justify-center px-3 py-2">
                        <span className="text-[13px] font-semibold text-foreground">
                          {room.number}{" "}
                          <span className="font-normal text-muted-foreground">· {room.category}</span>
                        </span>
                        <HkBadge status={room.housekeeping} className="mt-1 w-fit" />
                      </div>

                      <div className="relative col-span-7 grid grid-cols-7">
                        {days.map((d, i) => (
                          <div
                            key={d}
                            style={{ gridColumn: i + 1, gridRow: 1 }}
                            className={cn(
                              "h-[56px] border-l border-border/60 transition-colors",
                              d === DEMO_TODAY && "bg-primary/5",
                            )}
                          />
                        ))}

                        {room.housekeeping === "out-of-order" && (
                          <div className="pointer-events-none absolute inset-1 flex items-center justify-center gap-1.5 rounded-lg bg-rose-500/10 text-[12px] font-medium text-rose-600">
                            <Ban className="size-3.5" /> Out of order
                          </div>
                        )}

                        {rowRes.map((r) => {
                          const s = Math.max(0, nightsBetween(start, r.checkIn));
                          const e = Math.min(7, nightsBetween(start, r.checkOut));
                          const g = guestOf(r.guestId);
                          const clippedLeft = r.checkIn < start;

                          return (
                            <div
                              key={r.id}
                              style={{
                                gridColumn: `${s + 1} / span ${Math.max(1, e - s)}`,
                                gridRow: 1,
                              }}
                              className={cn(
                                "relative z-[1] mx-[3px] my-[7px] flex items-center gap-1.5 overflow-hidden rounded-lg px-2 text-left text-[12px] shadow-sm select-none",
                                resMeta[r.status].block,
                                clippedLeft && "rounded-l-none",
                              )}
                              title={`${r.id}: ${g.name} · ${r.source} · ${shortDate(r.checkIn)} → ${shortDate(r.checkOut)}`}
                            >
                              <span className="min-w-0 flex-1 truncate py-1">
                                <span className="font-semibold">{g.name}</span>
                                <span className="opacity-80"> · {r.id}</span>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>

      {/* Tape Chart Footer / Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-card/60 px-4 py-2.5 text-[11.5px] text-muted-foreground">
        <div className="flex flex-wrap items-center gap-4">
          {(["confirmed", "checked-in", "checked-out"] as const).map((s) => (
            <span key={s} className="flex items-center gap-1.5">
              <span className={cn("size-2.5 rounded-sm", resMeta[s].block)} />
              <span className="capitalize">{resMeta[s].label}</span>
            </span>
          ))}
        </div>
        <span>Real-time tape chart · Inventory automatically synchronized across direct engine &amp; OTAs</span>
      </div>
    </div>
  );
}
