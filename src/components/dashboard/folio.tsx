"use client";

import { Wallet, CheckCircle2 } from "lucide-react";
import { demoProperties, demoShift, demoRooms } from "@/data/demo-properties";
import { demoReservations } from "@/data/demo-reservations";
import { demoOrders, orderTotal } from "@/data/demo-orders";
import { guestOf } from "@/data/demo-guests";
import { nightsBetween, shortDate } from "@/lib/dates";
import { cn, formatMoney } from "@/lib/utils";
import type { CurrencyCode } from "@/types";

const DEMO_TAX_RATE = 0.12;

export function useFolio(reservationId: string | null) {
  const res = demoReservations.find((r) => r.id === (reservationId ?? "RSV-1039")) ?? demoReservations[0];
  if (!res) return null;
  const room = demoRooms.find((r) => r.id === res.roomId)!;
  const property = demoProperties.find((p) => p.id === res.propertyId)!;
  const nights = nightsBetween(res.checkIn, res.checkOut);
  const roomNumber = room.number;
  const orders = demoOrders.filter((o) => o.propertyId === res.propertyId && o.guestId === res.guestId && o.payment === "Charged to room");
  const lines = [
    { label: `Room ${roomNumber} · ${room.category} · ${nights} night${nights > 1 ? "s" : ""} × ${formatMoney(room.rate, property.currency)}`, amount: room.rate * nights },
    ...(res.children ? [{ label: "Extra bed (child)", amount: 800 * nights }] : []),
    ...orders.map((o) => ({ label: `${o.id} · ${o.channel} · ${o.items.map((i) => i.name).join(", ")}`, amount: orderTotal(o) })),
  ];
  const subtotal = lines.reduce((s, l) => s + l.amount, 0);
  const tax = Math.round(subtotal * DEMO_TAX_RATE);
  const total = subtotal + tax;
  return { res, room, property, guest: guestOf(res.guestId), nights, lines, subtotal, tax, total, paid: res.paid, balance: total - res.paid, currency: property.currency as CurrencyCode };
}

export function FolioView({ reservationId }: { reservationId: string }) {
  const f = useFolio(reservationId);
  if (!f) return null;
  const m = (v: number) => formatMoney(v, f.currency);
  return (
    <div className="space-y-4 text-[13.5px]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-widest text-primary uppercase">Automated Guest Folio</p>
          <p className="mt-1 text-[17px] font-bold text-foreground">{f.property.name}</p>
          <p className="text-[12.5px] text-muted-foreground">{f.property.city}</p>
        </div>
        <div className="text-right text-[12.5px]">
          <p className="font-semibold text-foreground">INV-{f.res.id.slice(4)}</p>
          <p className="text-muted-foreground">{f.res.id}</p>
        </div>
      </div>

      <div className="rounded-xl border border-border/80 bg-muted/30 p-3 text-[12.5px] break-words">
        <p className="font-semibold text-foreground">{f.guest.name}</p>
        <p className="text-muted-foreground">{shortDate(f.res.checkIn)} → {shortDate(f.res.checkOut)} · {f.guest.email}</p>
      </div>

      <table className="w-full text-[13px] sm:text-[13.5px]">
        <tbody>
          {f.lines.map((l) => (
            <tr key={l.label} className="border-b border-border/60 align-top">
              <td className="py-2 pr-3 sm:pr-4 text-foreground break-words">{l.label}</td>
              <td className="py-2 text-right font-medium text-foreground whitespace-nowrap">{m(l.amount)}</td>
            </tr>
          ))}
          <tr><td className="pt-3 text-muted-foreground">Subtotal</td><td className="pt-3 text-right font-medium text-foreground">{m(f.subtotal)}</td></tr>
          <tr><td className="text-muted-foreground">GST Taxes ({DEMO_TAX_RATE * 100}%)</td><td className="text-right font-medium text-foreground">{m(f.tax)}</td></tr>
          <tr className="font-bold text-foreground"><td className="pt-2">Total Billed</td><td className="pt-2 text-right">{m(f.total)}</td></tr>
          <tr className="text-emerald-500 font-medium"><td>Payments Received</td><td className="text-right">− {m(f.paid)}</td></tr>
          <tr className={cn("text-[14.5px] sm:text-[15px] font-bold", f.balance > 0 ? "text-amber-500" : "text-emerald-500")}>
            <td className="pt-2">Outstanding Balance</td>
            <td className="pt-2 text-right">{m(Math.max(0, f.balance))}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function ShiftRegister() {
  const s = demoShift["grand-palace"];
  const expected = s.float + s.cash;
  const rows = [
    { label: "Opening cash float", v: s.float },
    { label: "Cash payments collected", v: s.cash },
    { label: "Card transactions settled", v: s.card, muted: true },
    { label: "UPI instant receipts", v: s.upi, muted: true },
  ];

  return (
    <div className="card min-w-0 overflow-hidden p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h4 className="flex items-center gap-2 text-[13.5px] sm:text-[14px] font-bold text-foreground">
          <Wallet className="size-4 shrink-0 text-primary" /> Shift Register · Evening Handover
        </h4>
        <span className="chip bg-emerald-500/10 text-emerald-500 font-semibold">
          <CheckCircle2 className="size-3" /> Balanced
        </span>
      </div>

      <dl className="space-y-2 text-[13.5px]">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between">
            <dt className={cn(r.muted ? "text-muted-foreground" : "text-foreground")}>{r.label}</dt>
            <dd className="font-semibold text-foreground">{formatMoney(r.v)}</dd>
          </div>
        ))}
        <div className="flex justify-between border-t border-border pt-2 font-bold text-foreground">
          <dt>Expected Cash in Drawer</dt>
          <dd className="text-primary">{formatMoney(expected)}</dd>
        </div>
      </dl>

      <div className="mt-4 rounded-xl border border-border/80 bg-muted/30 p-3 text-[13px]">
        <p className="font-semibold text-foreground">Handover Notes</p>
        <p className="mt-1 text-[12.5px] text-muted-foreground leading-relaxed">
          Drawer counted &amp; verified. All credit card batches matched terminal reports. 2 late arrivals scheduled after 11 PM with keycards ready at reception.
        </p>
      </div>
    </div>
  );
}
