import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export function PageHero({
  title,
  lead,
  eyebrow,
  crumbs,
  children,
}: {
  title: ReactNode;
  lead?: ReactNode;
  eyebrow?: string;
  crumbs: { label: string; href?: string }[];
  children?: ReactNode;
}) {
  return (
    <section className="relative -mt-[72px] overflow-hidden pt-[72px]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-brand-100 via-brand-50 to-brand-50" />
      <div className="grid-bg pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
      <div className="pointer-events-none absolute top-[-160px] left-1/2 -z-10 h-[380px] w-[760px] -translate-x-1/2 rounded-full bg-brand-400/20 blur-[110px]" />
      <div className="container-x pt-10 pb-14 sm:pt-14 sm:pb-20">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-[13px] text-muted-foreground">
            <li><Link href="/" className="hover:text-ink">Home</Link></li>
            {crumbs.map((c) => (
              <li key={c.label} className="flex items-center gap-1">
                <ChevronRight className="size-3.5" aria-hidden />
                {c.href ? <Link href={c.href} className="hover:text-ink">{c.label}</Link> : <span aria-current="page" className="text-ink">{c.label}</span>}
              </li>
            ))}
          </ol>
        </nav>
        <div className="mt-8 max-w-3xl">
          {eyebrow && <p className="eyebrow [animation:wr_0.6s_ease_both]"><span className="size-1.5 rounded-full bg-gold-400" />{eyebrow}</p>}
          <h1 className="mt-4 text-[40px] leading-[1.02] font-semibold tracking-[-0.035em] text-balance text-ink sm:text-[58px] [animation:wr_0.8s_0.1s_cubic-bezier(0.22,1,0.36,1)_both]">{title}</h1>
          {lead && <p className="lead mt-5 max-w-2xl [animation:wr_0.8s_0.25s_cubic-bezier(0.22,1,0.36,1)_both]">{lead}</p>}
          {children && <div className="mt-8 [animation:wr_0.8s_0.4s_cubic-bezier(0.22,1,0.36,1)_both]">{children}</div>}
        </div>
      </div>
    </section>
  );
}
