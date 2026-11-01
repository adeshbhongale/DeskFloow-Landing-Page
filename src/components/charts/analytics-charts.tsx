"use client";

import { useState } from "react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { format, parseISO } from "date-fns";
import { demoHistory, demoRooms, categoryRates } from "@/data/demo-properties";
import { demoReservations } from "@/data/demo-reservations";
import { weekFrom, shiftIso, DEMO_TODAY } from "@/lib/dates";
import { cn, inr } from "@/lib/utils";
import type { PropertyId, RoomCategory } from "@/types";

const PALETTE = ["#8C5CFF", "#5427B8", "#FFC95C", "#CBB5FF", "#18A874", "#E65368", "#3B82F6", "#F0AE2E", "#746B86"];
const days = weekFrom(shiftIso(DEMO_TODAY, -6)).map((d) => format(parseISO(d), "EEE"));

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid var(--border)",
  backgroundColor: "var(--card)",
  color: "var(--foreground)",
  fontSize: 12,
  boxShadow: "0 8px 24px -12px rgb(36 20 66 / .25)",
};

export function RevenueChart({ propertyId = "grand-palace" }: { propertyId?: PropertyId }) {
  const [type, setType] = useState<"area" | "bar">("area");
  const h = demoHistory[propertyId] ?? demoHistory["grand-palace"];
  const data = days.map((d, i) => ({ day: d, revenue: h.revenue[i], occupancy: h.occupancy[i] }));

  return (
    <ChartCard
      title="Revenue · last 7 days"
      action={
        <div className="flex rounded-full bg-muted p-0.5 text-[11.5px]" role="tablist" aria-label="Chart type">
          {(["area", "bar"] as const).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={type === t}
              onClick={() => setType(t)}
              className={cn(
                "rounded-full px-2.5 py-1 capitalize transition",
                type === t
                  ? "bg-card font-semibold text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      }
    >
      <ResponsiveContainer width="100%" height={220}>
        {type === "area" ? (
          <AreaChart data={data} margin={{ left: -12, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="rev" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#8C5CFF" stopOpacity={0.35} />
                <stop offset="1" stopColor="#8C5CFF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
            <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" tickFormatter={(v) => `₹${v / 1000}k`} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => inr(Number(v))} />
            <Area type="monotone" dataKey="revenue" stroke="#7340EB" strokeWidth={2.5} fill="url(#rev)" />
          </AreaChart>
        ) : (
          <BarChart data={data} margin={{ left: -12, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
            <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" tickFormatter={(v) => `₹${v / 1000}k`} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => inr(Number(v))} cursor={{ fill: "var(--muted)" }} />
            <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
              {data.map((_, i) => <Cell key={i} fill={i === data.length - 2 ? "#FFC95C" : "#AB88FF"} />)}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function OccupancyChart({ propertyId = "grand-palace" }: { propertyId?: PropertyId }) {
  const h = demoHistory[propertyId] ?? demoHistory["grand-palace"];
  const data = days.map((d, i) => ({ day: d, occupancy: h.occupancy[i] }));

  return (
    <ChartCard title="Occupancy trend">
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ left: -20, right: 8, top: 8 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
          <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
          <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}%`} />
          <Line type="monotone" dataKey="occupancy" stroke="#5427B8" strokeWidth={2.5} dot={{ r: 3, fill: "#FFC95C", stroke: "#5427B8" }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function SourceDonut() {
  const reservations = demoReservations.filter((r) => r.propertyId === "grand-palace");
  const counts = new Map<string, number>();
  reservations.forEach((r) => counts.set(r.source, (counts.get(r.source) ?? 0) + 1));
  const data = [...counts].map(([name, value]) => ({ name, value }));

  return (
    <ChartCard title="Booking sources">
      <div className="flex flex-col min-[440px]:flex-row items-center gap-3 sm:gap-4">
        <div className="h-[150px] w-full min-[440px]:w-[46%] sm:h-[170px] sm:w-1/2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={40} outerRadius={64} paddingAngle={3} stroke="none">
                {data.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="w-full min-w-0 flex-1 space-y-1.5 text-[12px]">
          {data.map((d, i) => (
            <li key={d.name} className="flex items-center justify-between gap-2">
              <span className="flex min-w-0 items-center gap-2 truncate">
                <span className="size-2 shrink-0 rounded-full" style={{ background: PALETTE[i % PALETTE.length] }} />
                <span className="truncate text-foreground">{d.name}</span>
              </span>
              <span className="shrink-0 font-semibold text-foreground">{d.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </ChartCard>
  );
}

export function CategoryChart() {
  const rooms = demoRooms.filter((r) => r.propertyId === "grand-palace");
  const inHouse = demoReservations.filter((r) => r.propertyId === "grand-palace" && r.status === "checked-in");
  const [metric, setMetric] = useState<"occupancy" | "revpar">("occupancy");
  const cats = [...new Set(rooms.map((r) => r.category))] as RoomCategory[];

  const data = cats.map((c) => {
    const total = rooms.filter((r) => r.category === c).length;
    const occ = inHouse.filter((res) => rooms.find((r) => r.id === res.roomId)?.category === c).length;
    return {
      category: c,
      occupancy: Math.round((occ / total) * 100),
      revpar: Math.round((occ * categoryRates[c]) / total),
    };
  });

  return (
    <ChartCard
      title={metric === "occupancy" ? "Occupancy by room category" : "RevPAR by room category"}
      action={
        <select
          value={metric}
          onChange={(e) => setMetric(e.target.value as typeof metric)}
          className="rounded-full border border-border bg-card px-2.5 py-1 text-[11.5px] text-foreground"
          aria-label="Category metric"
        >
          <option value="occupancy">Occupancy</option>
          <option value="revpar">RevPAR</option>
        </select>
      }
    >
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
          <XAxis type="number" hide domain={metric === "occupancy" ? [0, 100] : undefined} />
          <YAxis type="category" dataKey="category" tickLine={false} axisLine={false} fontSize={11.5} width={70} stroke="var(--muted-foreground)" />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} formatter={(v) => (metric === "occupancy" ? `${v}%` : inr(Number(v)))} />
          <Bar dataKey={metric} radius={[0, 6, 6, 0]} fill="#8C5CFF" barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function ChartCard({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="card min-w-0 overflow-hidden p-3.5 sm:p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-[13px] sm:text-[13.5px] font-bold text-foreground">{title}</h4>
        {action}
      </div>
      {children}
    </div>
  );
}
