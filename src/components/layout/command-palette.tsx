"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BedDouble, CalendarCheck, CalendarRange, Globe2, MessageCircle, Network,
  Search, Sparkles, UsersRound, UtensilsCrossed, BarChart3,
  ArrowRight, CornerDownLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchEntry {
  id: string;
  category: "Feature" | "Action";
  title: string;
  meta: string;
  href: string;
  Icon: typeof Search;
}

const searchEntries: SearchEntry[] = [
  // Features
  { id: "f-frontdesk", category: "Feature", title: "Front Desk PMS & Night Audit", meta: "Arrivals, departures, folios, cash drawer & shift registers", href: "/features#front-desk", Icon: BedDouble },
  { id: "f-tapechart", category: "Feature", title: "Visual Interactive Tape Chart", meta: "7-day room inventory matrix with instant drag-and-drop", href: "/features#tape-chart", Icon: CalendarRange },
  { id: "f-channels", category: "Feature", title: "2-Way OTA Channel Manager", meta: "Instant sync with Booking.com, Airbnb, Expedia, Agoda, MMT", href: "/features#channels", Icon: Network },
  { id: "f-booking", category: "Feature", title: "Direct Commission-Free Booking Engine", meta: "Fast, mobile-optimized booking engine on your domain", href: "/features#booking", Icon: Globe2 },
  { id: "f-whatsapp", category: "Feature", title: "WhatsApp Guest Concierge & Digital Keys", meta: "Automated pre-arrival, digital key delivery & room requests", href: "/features#whatsapp", Icon: MessageCircle },
  { id: "f-crm", category: "Feature", title: "Guest CRM, History & Loyalty", meta: "Guest profiles, VIP tags, preferences and stay history", href: "/features#crm", Icon: UsersRound },
  { id: "f-housekeeping", category: "Feature", title: "Smart Housekeeping & Visual Floor Plans", meta: "Live room readiness status, dirty-room guard & checklists", href: "/features#housekeeping", Icon: Sparkles },
  { id: "f-orders", category: "Feature", title: "Restaurant POS & Room Service Billing", meta: "Contactless QR menus, orders directly billed to room folio", href: "/features#orders", Icon: UtensilsCrossed },
  { id: "f-analytics", category: "Feature", title: "Revenue Management & Analytics", meta: "Real-time occupancy, ADR, RevPAR and source mix reporting", href: "/features#analytics", Icon: BarChart3 },

  // Actions
  { id: "a-demo", category: "Action", title: "Book a Guided Live Product Demo", meta: "Schedule a personalized 1-on-1 walkthrough for your hotel", href: "/book-demo", Icon: CalendarCheck },
  { id: "a-pricing", category: "Action", title: "View Plans & Pricing", meta: "Explore transparent pricing tailored for your room count", href: "/pricing", Icon: BarChart3 },
  { id: "a-contact", category: "Action", title: "Contact Our Hospitality Specialists", meta: "Have questions about migrations, hardware or custom setups?", href: "/contact", Icon: MessageCircle },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("deskfloow:palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("deskfloow:palette", onOpen);
    };
  }, []);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      setQuery("");
      setActive(0);
    }
    if (!open && d.open) d.close();
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return searchEntries.slice(0, 8);
    return searchEntries.filter((r) =>
      `${r.title} ${r.meta} ${r.category}`.toLowerCase().includes(q)
    ).slice(0, 10);
  }, [query]);

  const choose = (r: SearchEntry) => {
    setOpen(false);
    router.push(r.href);
  };

  return (
    <dialog
      ref={ref}
      onClose={() => setOpen(false)}
      onClick={(e) => e.target === ref.current && setOpen(false)}
      aria-label="Search DeskFloow features and actions"
      className="mx-auto mt-[12vh] w-[min(640px,calc(100vw-24px))] rounded-3xl bg-transparent p-0 backdrop:bg-brand-950/60 backdrop:backdrop-blur-md"
    >
      <div className="card overflow-hidden border border-border shadow-2xl bg-card text-card-foreground">
        <div className="flex items-center gap-3 border-b border-border px-5">
          <Search className="size-5 text-primary" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, results.length - 1));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              }
              if (e.key === "Enter" && results[active]) {
                choose(results[active]);
              }
            }}
            placeholder="Search features, channel manager, pricing, contact..."
            className="h-16 flex-1 bg-transparent text-[15px] font-medium text-foreground outline-none placeholder:text-muted-foreground/60"
          />
          <kbd className="hidden rounded-lg border border-border bg-muted px-2 py-1 text-[11px] font-semibold text-muted-foreground sm:inline-block">
            ESC
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin">
          {results.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-[14px] font-medium text-muted-foreground">No results found for &ldquo;{query}&rdquo;</p>
              <p className="mt-1 text-[13px] text-muted-foreground/70">Try searching for Tape Chart, WhatsApp, Pricing, or Contact</p>
            </div>
          ) : (
            <ul className="space-y-1">
              {results.map((r, i) => {
                const isSelected = i === active;
                const IconComponent = r.Icon;
                return (
                  <li key={r.id}>
                    <button
                      onClick={() => choose(r)}
                      onMouseEnter={() => setActive(i)}
                      className={cn(
                        "flex w-full items-center gap-3.5 rounded-2xl p-3 text-left transition",
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "text-foreground hover:bg-muted/60"
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-10 shrink-0 place-items-center rounded-xl",
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-primary/10 text-primary"
                        )}
                      >
                        <IconComponent className="size-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-[14px] font-semibold truncate">{r.title}</p>
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10.5px] font-medium tracking-wide uppercase",
                              isSelected
                                ? "bg-white/20 text-white"
                                : "bg-brand-100/70 text-brand-800"
                            )}
                          >
                            {r.category}
                          </span>
                        </div>
                        <p className={cn("text-[12px] truncate", isSelected ? "text-white/80" : "text-muted-foreground")}>
                          {r.meta}
                        </p>
                      </div>
                      <ArrowRight className={cn("size-4 shrink-0 opacity-60", isSelected && "opacity-100")} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-line bg-brand-50/50 px-4 py-2.5 text-[11.5px] text-muted-foreground">
          <span>Navigate with <kbd className="rounded border px-1">↑</kbd> <kbd className="rounded border px-1">↓</kbd></span>
          <span className="flex items-center gap-1">Select <CornerDownLeft className="size-3" /></span>
        </div>
      </div>
    </dialog>
  );
}
