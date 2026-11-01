import Image from "next/image";
import { ArrowRight, CalendarCheck, MessageSquare } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function FinalCta() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <Reveal className="relative mx-auto max-w-[1240px] overflow-hidden rounded-[36px] bg-gradient-to-br from-brand-900 via-brand-950 to-brand-950 px-6 py-20 text-center text-white sm:px-16 shadow-2xl">
        <Image
          src="/images/resort.jpg"
          alt="DeskFloow Luxury Resort Technology"
          fill
          sizes="1240px"
          className="object-cover opacity-20 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-900/80 via-brand-950/90 to-brand-950" />
        <div className="absolute top-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
        <div className="absolute -top-24 left-1/2 size-[460px] -translate-x-1/2 rounded-full bg-brand-500/35 blur-[110px]" />

        <div className="relative">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1 text-[12px] font-semibold tracking-wider text-gold-300 uppercase">
            Transform Your Hotel Operations
          </div>
          <h2 className="mx-auto max-w-3xl text-[36px] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[56px]">
            Make every part of your hotel work <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-amber-400 bg-clip-text text-transparent">in perfect flow.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[17px] text-white/75 leading-relaxed">
            Bring front-desk operations, reservations, room management, housekeeping, guest profiles, billing, and WhatsApp confirmations into one connected workspace.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/book-demo" variant="gold" size="lg">
              <CalendarCheck className="size-4.5" /> Book a Personalized Demo <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink href="/contact" variant="light" size="lg">
              <MessageSquare className="size-4" /> Contact Us
            </ButtonLink>
          </div>
          <p className="mt-6 text-[13px] text-white/50">
            Unified PMS workspace · Multi-property ready · Tailored guided walkthroughs
          </p>
        </div>
      </Reveal>
    </section>
  );
}
