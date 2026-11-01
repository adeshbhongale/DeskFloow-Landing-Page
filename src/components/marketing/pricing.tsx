"use client";

import { ButtonLink } from "@/components/ui/button";
import { cn, inr } from "@/lib/utils";
import { Check, Minus, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type Billing = "monthly" | "yearly";

/**
 * ILLUSTRATIVE pricing — not final commercial rates. Yearly is shown as
 * 12 × monthly (no discount is configured, so none is implied).
 */
export const plans = [
  { id: "boutique", name: "Boutique", for: "For small independent hotels and inns", perRoom: 249, unit: "per room / month", min: "Up to 30 rooms", cta: "Book a demo", href: "/book-demo", features: ["Front desk PMS & tape chart", "Direct booking engine", "Housekeeping & floor plan", "Guest CRM", "WhatsApp templates (requires your WABA)"] },
  { id: "growth", name: "Growth", for: "For growing hotels and full-service resorts", perRoom: 399, unit: "per room / month", min: "Up to 150 rooms", cta: "Book a demo", href: "/book-demo", featured: true, features: ["Everything in Boutique", "OTA channel manager (per channel setup)", "Restaurant & room-service orders", "Folios, invoices & shift register", "Analytics & revenue dashboards"] },
  { id: "enterprise", name: "Enterprise", for: "For multi-property groups and chains", perRoom: null, unit: "", min: "Multiple properties", cta: "Contact Team", href: "/contact", features: ["Everything in Growth", "Multi-property switching", "Centralized portfolio analytics", "Custom integrations & onboarding", "Dedicated success contact"] },
] as const;

export const comparisonRows: { label: string; values: (boolean | string)[] }[] = [
  { label: "Front desk PMS & tape chart", values: [true, true, true] },
  { label: "Direct booking engine", values: [true, true, true] },
  { label: "Housekeeping & 2D floor plan", values: [true, true, true] },
  { label: "Guest CRM & loyalty tiers", values: [true, true, true] },
  { label: "WhatsApp templates", values: ["Basic", "Full", "Full"] },
  { label: "OTA channel manager", values: [false, true, true] },
  { label: "Restaurant & room-service orders", values: [false, true, true] },
  { label: "Folios & shift register", values: [false, true, true] },
  { label: "Multi-property", values: [false, false, true] },
];

/** Signature animation 09 — animated monthly/yearly toggle. */
export function PricingCards({ showTable = false }: { showTable?: boolean }) {
  const [billing, setBilling] = useState<Billing>("monthly");
  const mult = billing === "monthly" ? 1 : 12;

  return (
    <div>
      <div className="flex flex-col items-center gap-3">
        <div className="relative flex rounded-full border border-line bg-white p-1 shadow-card" role="radiogroup" aria-label="Billing period">
          {(["monthly", "yearly"] as const).map((b) => (
            <button key={b} role="radio" aria-checked={billing === b} onClick={() => setBilling(b)} className={cn("relative z-10 rounded-full px-5 py-2 text-[14px] font-medium capitalize transition-colors", billing === b ? "text-white" : "text-muted-foreground hover:text-ink")}>
              {billing === b && <motion.span layoutId="billing-pill" className="absolute inset-0 -z-10 rounded-full bg-brand-600" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              {b}
            </button>
          ))}
        </div>
        <p className="text-[12.5px] text-muted-foreground">Illustrative pricing for evaluation · excludes taxes · final rates on request</p>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {plans.map((p) => {
          const featured = "featured" in p && p.featured;
          return (
            <div key={p.id} className={cn("relative flex flex-col rounded-3xl border p-7 transition", featured ? "border-gold-300 bg-brand-900 text-white shadow-[0_30px_80px_-30px_rgb(84_39_184/0.7)]" : "border-line bg-white")}>
              {featured && <span className="absolute -top-3 left-7 flex items-center gap-1 rounded-full bg-gold-400 px-3 py-1 text-[12px] font-semibold text-brand-950"><Sparkles className="size-3" /> Most complete for single properties</span>}
              <p className="text-[18px] font-semibold">{p.name}</p>
              <p className={cn("mt-1 text-[14px]", featured ? "text-white/65" : "text-muted-foreground")}>{p.for}</p>
              <div className="mt-6 h-[72px]">
                {p.perRoom ? (
                  <>
                    <div className="flex items-end gap-1.5 overflow-hidden">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span key={billing} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} transition={{ duration: 0.35 }} className="text-[44px] leading-none font-semibold tracking-tight">
                          {inr(p.perRoom * mult)}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <p className={cn("mt-1.5 text-[13px]", featured ? "text-white/60" : "text-muted-foreground")}>
                      per room / {billing === "monthly" ? "month" : "year, billed annually"} · {p.min}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-[36px] leading-none font-semibold tracking-tight">Contact us</p>
                    <p className={cn("mt-2 text-[13px]", featured ? "text-white/60" : "text-muted-foreground")}>Tailored to your portfolio</p>
                  </>
                )}
              </div>
              <ul className="mt-6 flex-1 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2.5 text-[14px]"><Check className={cn("mt-0.5 size-4 shrink-0", featured ? "text-gold-300" : "text-brand-600")} />{f}</li>
                ))}
              </ul>
              <ButtonLink href={p.href} variant={featured ? "gold" : "secondary"} className="mt-8 w-full">{p.cta}</ButtonLink>
            </div>
          );
        })}
      </div>

      {showTable && (
        <div className="mt-14 overflow-x-auto rounded-3xl border border-line bg-white scrollbar-thin">
          <table className="w-full min-w-[640px] text-[14px]">
            <caption className="sr-only">Plan feature comparison</caption>
            <thead>
              <tr className="border-b border-line bg-brand-50/60 text-left">
                <th scope="col" className="px-5 py-4 font-semibold">Feature</th>
                {plans.map((p) => <th key={p.id} scope="col" className="px-5 py-4 text-center font-semibold">{p.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((r) => (
                <tr key={r.label} className="border-b border-line last:border-0">
                  <th scope="row" className="px-5 py-3 text-left font-normal">{r.label}</th>
                  {r.values.map((v, i) => (
                    <td key={i} className="px-5 py-3 text-center">
                      {v === true ? <Check className="mx-auto size-4 text-brand-600" aria-label="Included" /> : v === false ? <Minus className="mx-auto size-4 text-muted-foreground/50" aria-label="Not included" /> : <span className="text-[13px] text-muted-foreground">{v}</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
