import type { Metadata } from "next";
import { ArrowRight, CalendarCheck } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { AboutShowcase } from "@/components/marketing/about-showcase";
import { FinalCta } from "@/components/marketing/final-cta";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us — Built for Modern Hospitality",
  description:
    "Learn how DeskFloow unifies hotel front-desk operations, reservations, housekeeping, guest communication, and analytics in one intelligent workspace.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "About Us" }]}
        eyebrow="About DeskFloow"
        title="Built to bring every part of your hotel into effortless flow."
        lead="We started DeskFloow with a simple conviction: hotel teams should spend their time welcoming guests, not reconciling five disconnected software tools."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/book-demo">
            <CalendarCheck className="size-4" /> Book a Guided Demo <ArrowRight className="size-4" />
          </ButtonLink>
          <ButtonLink href="/contact" variant="secondary">
            Contact Us
          </ButtonLink>
        </div>
      </PageHero>

      <AboutShowcase />
      <FinalCta />
    </>
  );
}
