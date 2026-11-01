"use client";

import { Check, X } from "lucide-react";
import { SectionHeading, Reveal } from "@/components/ui/reveal";
import { Logo } from "@/components/ui/logo";

const rows = [
  ["Reservation visibility", "Spread across channel extranets, spreadsheets and paper", "One reservation list and tape chart for every source"],
  ["Room assignment", "Manual, checked against a separate status board", "Drag-and-drop with overlap and room-status validation"],
  ["OTA distribution", "Availability updated channel by channel", "One inventory designed to propagate to connected channels"],
  ["Guest communication", "Personal phones and separate chat apps", "Template-based messages attached to the reservation"],
  ["Housekeeping coordination", "Calls, radios or paper lists", "Shared room status visible to the front desk"],
  ["Guest profiles", "Re-entered for every stay", "One profile with history, preferences and loyalty tier"],
  ["Restaurant & room service", "Separate POS or handwritten chits", "Orders linked to guest, room and folio"],
  ["Reporting", "Compiled manually from several exports", "Dashboards built from the same operational data"],
  ["Multi-property oversight", "Separate logins per property", "Switch properties from one account"],
];

/** Comparison table — fragmented workflow vs DeskFloow. */
export function Comparison() {
  return (
    <section className="py-16 sm:py-32">
      <div className="container-x">
        <SectionHeading
          align="center"
          eyebrow="Why unified matters"
          title="Fewer tools. Fewer handoffs. One source of truth."
          lead="A neutral look at the difference between running a hotel on disconnected tools and running it from one connected workspace."
        />

        <Reveal delay={0.08} className="mt-10 sm:mt-12 min-w-0">
          {/* Mobile Stacked Comparison Cards (no horizontal scroll required) */}
          <div className="grid gap-3 md:hidden">
            {rows.map(([area, fragmentedText, unifiedText]) => (
              <div
                key={area}
                className="overflow-hidden rounded-2xl border border-brand-200/80 bg-white shadow-sm"
              >
                <div className="border-b border-brand-100 bg-brand-50/60 px-4 py-2.5 text-[13.5px] font-bold text-ink">
                  {area}
                </div>
                <div className="divide-y divide-brand-100/70 p-3.5 space-y-2.5 text-[13px]">
                  <div className="flex items-start gap-2.5 text-muted-foreground pb-2.5">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-rose-50 text-danger ring-1 ring-rose-200/70">
                      <X className="size-3" strokeWidth={2.75} aria-label="Fragmented limitation" />
                    </span>
                    <div>
                      <span className="block text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground/80">
                        Fragmented Workflow
                      </span>
                      <span>{fragmentedText}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 font-medium text-ink pt-0.5">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-600 text-white shadow-2xs">
                      <Check className="size-3" strokeWidth={2.75} aria-label="Included in DeskFloow" />
                    </span>
                    <div>
                      <span className="block text-[10.5px] font-bold uppercase tracking-wider text-brand-700">
                        DeskFloow Unified Platform
                      </span>
                      <span>{unifiedText}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop / Tablet Full Comparison Table */}
          <div className="hidden md:block overflow-hidden rounded-3xl border border-brand-200/80 bg-white shadow-lift ring-1 ring-brand-100/70">
            <div className="h-1 w-full bg-gradient-to-r from-brand-600 via-brand-500 to-gold-400" aria-hidden />

            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full min-w-[680px] border-collapse text-left text-[14.5px]">
                <caption className="sr-only">Fragmented workflows compared with DeskFloow</caption>
                <thead>
                  <tr className="border-b border-brand-200/70 bg-brand-50/50">
                    <th scope="col" className="w-[24%] px-6 py-4.5 text-[12.5px] font-bold tracking-wider text-muted-foreground uppercase">
                      Operational Area
                    </th>
                    <th scope="col" className="w-[38%] px-6 py-4.5 text-[12.5px] font-bold tracking-wider text-muted-foreground uppercase">
                      Fragmented Workflow
                    </th>
                    <th scope="col" className="w-[38%] border-l border-brand-200/70 bg-brand-100/60 px-6 py-4">
                      <div className="flex items-center justify-between gap-2">
                        <Logo height={24} />
                        <span className="rounded-full border border-gold-300/80 bg-gold-100 px-2.5 py-0.5 text-[11px] font-semibold text-brand-950">
                          Unified Platform
                        </span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-100/80">
                  {rows.map(([area, fragmentedText, unifiedText]) => (
                    <tr key={area} className="transition-colors hover:bg-brand-50/25">
                      <th scope="row" className="px-6 py-4 font-semibold text-ink align-top">
                        {area}
                      </th>
                      <td className="px-6 py-4 text-muted-foreground align-top leading-relaxed">
                        <span className="flex items-start gap-2.5">
                          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-rose-50 text-danger ring-1 ring-rose-200/70">
                            <X className="size-3" strokeWidth={2.75} aria-label="Fragmented limitation" />
                          </span>
                          <span>{fragmentedText}</span>
                        </span>
                      </td>
                      <td className="border-l border-brand-200/60 bg-brand-50/45 px-6 py-4 font-medium text-ink align-top leading-relaxed">
                        <span className="flex items-start gap-2.5">
                          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-600 text-white shadow-2xs">
                            <Check className="size-3" strokeWidth={2.75} aria-label="Included in DeskFloow" />
                          </span>
                          <span>{unifiedText}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
