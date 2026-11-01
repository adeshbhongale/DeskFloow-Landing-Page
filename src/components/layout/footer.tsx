import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { platformNav } from "@/data/nav";

const cols = [
  {
    title: "Features",
    links: platformNav.slice(0, 6).map((n) => ({ label: n.label, href: n.href })),
  },
  {
    title: "Navigation",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      { label: "Book a Demo", href: "/book-demo" },
      { label: "FAQs", href: "/#faq" },
    ],
  },
  {
    title: "Resources & Legal",
    links: [
      { label: "How DeskFloow Works", href: "/#how-it-works" },
      { label: "Hotelier Reviews", href: "/#reviews" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-brand-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgb(140_92_255/0.25),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />
      <div className="container-x relative grid gap-12 py-16 lg:grid-cols-[1.2fr_2fr]">
        <div className="max-w-sm">
          <Logo tone="light" height={40} />
          <p className="mt-5 text-[14px] leading-relaxed text-white/65">
            DeskFloow is a hotel property management platform that brings reservations, front desk, OTA distribution,
            housekeeping, guest communication, orders and analytics into one workspace.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-[13px]">
            <Link href="/about" className="rounded-full border border-white/15 px-3.5 py-1.5 text-white/80 hover:border-gold-300 hover:text-gold-200">
              About Us
            </Link>
            <Link href="/contact" className="rounded-full border border-white/15 px-3.5 py-1.5 text-white/80 hover:border-gold-300 hover:text-gold-200">
              Contact Us
            </Link>
            <Link href="/book-demo" className="rounded-full bg-gold-400 px-3.5 py-1.5 font-medium text-brand-950 hover:bg-gold-300">
              Book a Demo
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {cols.map((c) => (
            <div key={c.title}>
              <p className="text-[12px] font-semibold tracking-widest text-gold-300/90 uppercase">{c.title}</p>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-[14px] text-white/65 transition hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="container-x relative flex flex-col gap-3 border-t border-white/10 py-6 text-[13px] text-white/50 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 DeskFloow. The Intelligent Hotel Property Management &amp; Guest Experience Platform.</p>
        <div className="flex flex-wrap gap-5">
          <Link href="/about" className="hover:text-white">About Us</Link>
          <Link href="/pricing" className="hover:text-white">Pricing</Link>
          <Link href="/privacy" className="hover:text-white">Privacy</Link>
          <Link href="/terms" className="hover:text-white">Terms</Link>
          <Link href="/contact" className="hover:text-white">Contact Us</Link>
        </div>
      </div>
    </footer>
  );
}
