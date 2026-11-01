"use client";

import { useState } from "react";
import { QrCode, BellRing, Monitor, ConciergeBell, Clock } from "lucide-react";
import { demoOrders, orderFlow, orderTotal } from "@/data/demo-orders";
import { guestOf } from "@/data/demo-guests";
import { cn, inr } from "@/lib/utils";
import type { OrderChannel, OrderStatus } from "@/types";

const statusMeta: Record<OrderStatus, { label: string; cls: string }> = {
  new: { label: "New", cls: "bg-amber-500/15 text-amber-600 ring-amber-500/30" },
  accepted: { label: "Accepted", cls: "bg-primary/15 text-primary ring-primary/30" },
  preparing: { label: "Preparing", cls: "bg-sky-500/15 text-sky-600 ring-sky-500/30" },
  ready: { label: "Ready", cls: "bg-emerald-500/15 text-emerald-600 ring-emerald-500/30" },
  delivered: { label: "Delivered", cls: "bg-muted text-muted-foreground ring-border" },
};

const channelIcon: Record<OrderChannel, typeof QrCode> = {
  "Guest QR": QrCode,
  "Room Service": BellRing,
  "Restaurant POS": Monitor,
  "Front Desk": ConciergeBell,
};

export function OrderBoard() {
  const [channel, setChannel] = useState<OrderChannel | "All">("All");
  const orders = demoOrders.filter((o) => o.propertyId === "grand-palace");
  const shown = orders.filter((o) => channel === "All" || o.channel === channel);

  return (
    <div className="min-w-0 max-w-full space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
        <div className="flex max-w-full gap-1.5 overflow-x-auto no-scrollbar sm:flex-wrap" role="group" aria-label="Filter by order channel">
          {(["All", "Guest QR", "Room Service", "Restaurant POS", "Front Desk"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setChannel(c)}
              aria-pressed={channel === c}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-[12px] font-medium transition",
                channel === c
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <span className="text-[12px] text-muted-foreground">
          Auto-posted directly to guest room folios
        </span>
      </div>

      <div className="grid max-w-full grid-flow-col auto-cols-[minmax(220px,1fr)] gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {orderFlow.map((s) => {
          const col = shown.filter((o) => o.status === s);
          return (
            <div key={s} className="rounded-2xl border border-border/60 bg-muted/20 p-2.5">
              <div className="mb-2 flex items-center justify-between px-1">
                <span className={cn("chip ring-1 ring-inset font-semibold", statusMeta[s].cls)}>
                  {statusMeta[s].label}
                </span>
                <span className="text-[12px] font-semibold text-muted-foreground">{col.length}</span>
              </div>

              <ul className="min-h-[140px] space-y-2">
                {col.length === 0 ? (
                  <li className="flex h-28 items-center justify-center rounded-xl border border-dashed border-border/70 text-[12px] text-muted-foreground">
                    No orders
                  </li>
                ) : (
                  col.map((o) => {
                    const g = guestOf(o.guestId);
                    const Icon = channelIcon[o.channel];
                    return (
                      <li key={o.id} className="card p-3 shadow-sm">
                        <div className="flex items-center justify-between text-[12px]">
                          <span className="font-bold text-foreground">{o.id}</span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="size-3" />
                            {o.time}
                          </span>
                        </div>
                        <p className="mt-1 text-[13px] font-semibold text-foreground">
                          {g.name} · Room {o.roomNumber}
                        </p>
                        <p className="truncate text-[12px] text-muted-foreground mt-0.5">
                          {o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
                        </p>
                        <div className="mt-2.5 flex items-center justify-between text-[12px] border-t border-border/60 pt-2">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Icon className="size-3.5 text-primary" />
                            {o.channel}
                          </span>
                          <span className="font-bold text-foreground">{inr(orderTotal(o))}</span>
                        </div>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
