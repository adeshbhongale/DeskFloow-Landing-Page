"use client";

import { WordReveal } from "@/components/animations/word-reveal";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { ArrowRight, CalendarCheck, Check } from "lucide-react";
import Image from "next/image";
import { HeroDashboard } from "./hero-dashboard";

export function Hero() {
  return (
    <section className="relative -mt-[72px] overflow-hidden pt-[72px]">
      {/* Background gradients matching brand ultraviolet and warm gold */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-brand-100 via-brand-50/70 to-white" />
      <div className="grid-bg pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black_35%,transparent_75%)]" />
      <div className="pointer-events-none absolute top-[-220px] left-1/2 -z-10 h-[560px] w-[980px] -translate-x-1/2 rounded-full bg-brand-500/25 blur-[130px]" />
      <div className="pointer-events-none absolute top-[140px] right-[10%] -z-10 size-60 rounded-full bg-gold-400/25 blur-[100px]" />
      <div className="pointer-events-none absolute top-[300px] left-[6%] -z-10 size-52 rounded-full bg-brand-400/20 blur-[100px]" />

      <div className="mx-auto w-full max-w-[1340px] px-5 pt-4 pb-28 sm:px-8 sm:pt-7 sm:pb-36">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200/90 bg-white/80 px-4 py-1.5 text-[12.5px] font-semibold text-brand-800 shadow-sm backdrop-blur [animation:wr_0.7s_ease_both]">
            <span className="size-2 animate-pulse-soft rounded-full bg-gold-500" />
            The Next-Generation Hotel PMS &amp; Guest Experience Platform
          </div>

          <h1 className="h-display mt-5 text-ink">
            <WordReveal
              lines={["An Intelligent Hotel", "Operations Platform"]}
              highlight={["Intelligent", "Operations"]}
              baseDelay={0.15}
            />
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-[18px] leading-relaxed text-muted-foreground sm:text-[20px] [animation:wr_0.8s_0.75s_cubic-bezier(0.22,1,0.36,1)_both]">
            Unify your front desk, reservations, OTA channels, housekeeping, and WhatsApp confirmations in one connected workspace.
          </p>

          <div className="mt-7 flex items-center justify-center [animation:wr_0.8s_0.9s_cubic-bezier(0.22,1,0.36,1)_both]">
            <ButtonLink href="/book-demo" size="lg" className="px-7 shadow-brand-glow">
              <CalendarCheck className="size-4.5" /> Book a Guided Demo <ArrowRight className="size-4" />
            </ButtonLink>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] font-medium text-ink/85 [animation:wr_0.8s_1s_cubic-bezier(0.22,1,0.36,1)_both]">
            <span className="flex items-center gap-1.5">
              <Check className="size-4 text-success" /> 2-Way Instant OTA Sync
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="size-4 text-success" /> Automated WhatsApp Confirmations
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="size-4 text-success" /> Multi-Property Ready
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="size-4 text-success" /> 99.9% Uptime SLA
            </span>
          </div>
        </div>

        {/* Larger Hero Front Desk Visual Box with 3 KPI Cards on Right Side (50% over image, 50% outside image) */}
        <div className="relative mx-auto mt-10 max-w-[1260px] [animation:tilt_1.1s_0.2s_cubic-bezier(0.22,1,0.36,1)_both]">
          <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[36px] bg-[radial-gradient(60%_50%_at_50%_35%,rgb(140_92_255/0.22),transparent_70%)] blur-2xl" />

          <div className="relative lg:mr-[175px]">
            {/* Retained Front Desk Visual (Increased Size) */}
            <div className="relative overflow-hidden rounded-[28px] border border-brand-200/80 bg-white shadow-lift ring-1 ring-white/80">
              <div className="relative aspect-[16/9] w-full bg-brand-950">
                <Image
                  src="/images/pms-laptop-mockup.jpg"
                  alt="DeskFloow Hotel PMS running on a laptop at a luxury hotel reception desk"
                  fill
                  sizes="(min-width: 1280px) 1100px, 100vw"
                  className="object-cover"
                  priority
                />
                {/* Official DeskFloow branding on the laptop screen top bar */}
                <div
                  className="pointer-events-none absolute top-[30.0%] left-[33.6%] flex h-[2.85%] w-[31.9%] items-center justify-between rounded-t-[2px] bg-[#3b1d70] px-1.5 sm:px-2"
                  aria-hidden
                >
                  <Logo tone="light" height={13} className="gap-1 sm:gap-1.5" />
                  <span className="hidden text-[8px] font-medium text-gold-300/90 sm:inline lg:text-[9px]">Grand Palace · PMS</span>
                </div>
              </div>
            </div>

            {/* 3 KPI Cards on the right side: 50% overlapping inside the image, 50% outside to the right */}
            <div className="mx-auto mt-8 mb-4 w-full max-w-[380px] lg:absolute lg:top-1/2 lg:right-0 lg:z-20 lg:my-0 lg:w-[350px] lg:max-w-none lg:translate-x-1/2 lg:-translate-y-1/2">
              <HeroDashboard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
