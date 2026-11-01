"use client";

import {
  ArrowDownRight, ArrowUpRight, Percent, IndianRupee, Wallet, Banknote, Crown, RotateCcw, Moon, Salad, CreditCard, ShieldCheck,
} from "lucide-react";
import { CountUp } from "@/components/animations/count-up";
import { RevenueChart, OccupancyChart, SourceDonut, CategoryChart } from "@/components/charts/analytics-charts";
import { HkBadge, ResBadge, hkMeta } from "@/components/ui/badges";
import { demoRooms, demoShift } from "@/data/demo-properties";
import { demoReservations } from "@/data/demo-reservations";
import { guestOf } from "@/data/demo-guests";
import { propertySnapshot } from "@/lib/metrics";
import { shortDate } from "@/lib/dates";
import { cn, inr } from "@/lib/utils";
import type { HousekeepingStatus, Reservation } from "@/types";

export function KpiCards() {
  const snap = propertySnapshot("grand-palace");
  const kpis = [
    { label: "Arrivals today", value: snap.arrivals.length, icon: ArrowDownRight },
    { label: "Departures today", value: snap.departures.length, icon: ArrowUpRight },
    { label: "Occupancy", value: snap.occupancy, icon: Percent, fmt: (n: number) => `${Math.round(n)}%`, accent: true },
    { label: "Revenue today", value: snap.revenueToday, icon: IndianRupee, fmt: (n: number) => inr(n) },
    { label: "Direct share", value: 68, icon: Wallet, fmt: (n: number) => `${n}%` },
    { label: "Shift cash float", value: demoShift["grand-palace"].float, icon: Banknote, fmt: (n: number) => inr(n) },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 xl:grid-cols-6">
      {kpis.map((k) => (
        <div key={k.label} className={cn("card min-w-0 overflow-hidden p-3 sm:p-4", k.accent && "border-primary/40 ring-1 ring-primary/30")}>
          <p className="flex items-center justify-between gap-1 text-[11.5px] sm:text-[12px] font-medium text-muted-foreground">
            <span className="truncate">{k.label}</span>
            <k.icon className={cn("size-3.5 sm:size-4 shrink-0", k.accent ? "text-primary" : "text-muted-foreground")} />
          </p>
          <CountUp value={k.value} format={k.fmt} className="mt-1.5 sm:mt-2 block truncate text-[18px] sm:text-[22px] font-semibold tracking-tight text-foreground" />
        </div>
      ))}
    </div>
  );
}

type Alert = { id: string; kind: string; icon: typeof Crown; tone: string; res: Reservation; text: string };

export function GuestAlerts() {
  const reservations = demoReservations.filter((r) => r.propertyId === "grand-palace");
  const alerts: Alert[] = [];

  reservations.forEach((r) => {
    if (r.status === "cancelled" || r.status === "checked-out") return;
    const g = guestOf(r.guestId);
    if (g.vip && r.status === "confirmed") {
      alerts.push({ id: r.id + "vip", kind: "VIP arrival", icon: Crown, tone: "text-amber-500 bg-amber-500/10", res: r, text: `${g.name} arrives ${shortDate(r.checkIn)}` });
    } else if (g.returning && r.status === "confirmed") {
      alerts.push({ id: r.id + "ret", kind: "Returning guest", icon: RotateCcw, tone: "text-primary bg-primary/10", res: r, text: `${g.name} · stay #${g.stays + 1}` });
    }
    if (r.notes?.toLowerCase().includes("late")) {
      alerts.push({ id: r.id + "late", kind: "Late check-in", icon: Moon, tone: "text-sky-500 bg-sky-500/10", res: r, text: g.specialRequests ?? "Arriving late" });
    }
    if (g.dietary && r.status === "checked-in") {
      alerts.push({ id: r.id + "diet", kind: "Dietary request", icon: Salad, tone: "text-emerald-500 bg-emerald-500/10", res: r, text: `${g.name} · ${g.dietary}` });
    }
    if (r.total - r.paid > 0 && r.status === "checked-in") {
      alerts.push({ id: r.id + "pay", kind: "Folio balance", icon: CreditCard, tone: "text-rose-500 bg-rose-500/10", res: r, text: `${g.name} · ${inr(r.total - r.paid)} pending` });
    }
  });

  return (
    <div className="card min-w-0 overflow-hidden p-3.5 sm:p-4">
      <h4 className="mb-3 text-[13.5px] font-semibold text-foreground">Guest alerts &amp; preferences</h4>
      <ul className="space-y-2">
        {alerts.slice(0, 5).map((a) => (
          <li key={a.id} className="flex items-center gap-2.5 sm:gap-3 rounded-xl border border-border/50 bg-card/60 p-2.5">
            <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg", a.tone)}>
              <a.icon className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-medium text-foreground">{a.kind}</span>
              <span className="block truncate text-[12px] text-muted-foreground">{a.text}</span>
            </span>
            <span className="chip shrink-0 bg-muted text-[10.5px] sm:text-[11px] font-mono text-muted-foreground">{a.res.id}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HousekeepingOverview() {
  const rooms = demoRooms.filter((r) => r.propertyId === "grand-palace");
  const statuses: HousekeepingStatus[] = ["clean", "cleaning", "dirty", "out-of-order"];

  return (
    <div className="card min-w-0 overflow-hidden p-3.5 sm:p-4">
      <h4 className="mb-3 text-[13.5px] font-semibold text-foreground">Housekeeping live status</h4>
      <div className="grid grid-cols-2 gap-2">
        {statuses.map((s) => {
          const n = rooms.filter((r) => r.housekeeping === s).length;
          return (
            <div key={s} className="min-w-0 overflow-hidden rounded-xl border border-border/70 bg-card/50 p-2.5 sm:p-3">
              <HkBadge status={s} />
              <p className="mt-2 text-[20px] sm:text-[22px] font-semibold text-foreground">{n}</p>
              <p className="truncate text-[11.5px] text-muted-foreground">
                {rooms.filter((r) => r.housekeeping === s).map((r) => r.number).join(", ") || "—"}
              </p>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex h-2 overflow-hidden rounded-full" aria-hidden>
        {statuses.map((s) => (
          <div
            key={s}
            className={hkMeta[s].dot}
            style={{ width: `${(rooms.filter((r) => r.housekeeping === s).length / rooms.length) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}

/** Today's arrivals read-only preview. */
export function ArrivalsPanel() {
  const snap = propertySnapshot("grand-palace");
  const arrivals = snap.arrivals;
  const rooms = snap.rooms;

  return (
    <div className="card min-w-0 overflow-hidden p-3.5 sm:p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-1.5">
        <h4 className="text-[13.5px] font-semibold text-foreground">Today&apos;s arrivals</h4>
        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <ShieldCheck className="size-3.5 shrink-0 text-emerald-500" /> Automated room verification
        </span>
      </div>
      <ul className="space-y-2">
        {arrivals.length === 0 && <li className="py-4 text-center text-[13px] text-muted-foreground">No arrivals today.</li>}
        {arrivals.slice(0, 4).map((r, i) => {
          const g = guestOf(r.guestId);
          const room = rooms.find((x) => x.id === r.roomId)!;
          return (
            <li key={r.id} className="rounded-xl border border-border/70 bg-card/50 p-2.5 sm:p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-medium text-foreground">{g.name}</p>
                  <p className="truncate text-[12px] text-muted-foreground">
                    {r.id} · Room {room.number} · {r.source}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <HkBadge status={room.housekeeping} />
                  {i === 0 ? (
                    <ResBadge status="checked-in" />
                  ) : (
                    <span className="chip bg-primary/10 text-primary">Pre-Registered</span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function FrontDeskDashboard({ compact = false }: { compact?: boolean }) {
  return (
    <div className="grid min-w-0 gap-3 sm:gap-4">
      <KpiCards />
      <div className="grid min-w-0 gap-3 sm:gap-4 lg:grid-cols-[1.6fr_1fr]">
        <RevenueChart />
        <SourceDonut />
      </div>
      {!compact && (
        <div className="grid min-w-0 gap-3 sm:gap-4 lg:grid-cols-2">
          <OccupancyChart />
          <CategoryChart />
        </div>
      )}
      <div className="grid min-w-0 gap-3 sm:gap-4 lg:grid-cols-3">
        <ArrivalsPanel />
        <GuestAlerts />
        <HousekeepingOverview />
      </div>
    </div>
  );
}
