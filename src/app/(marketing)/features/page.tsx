import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { FeaturePillars } from "@/components/marketing/pillars";
import { FinalCta } from "@/components/marketing/final-cta";

export const metadata: Metadata = {
  title: "Features — Front desk, tape chart, channel manager, WhatsApp & more",
  description: "Explore DeskFloow's hotel PMS modules: front desk dashboard, drag-and-drop tape chart, OTA channel manager, WhatsApp guest messaging, housekeeping floor plan, guest CRM, room-service orders and folios.",
  alternates: { canonical: "/features" },
};

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Features" }]}
        eyebrow="Features"
        title="Every hotel operation, on one connected record."
        lead="Explore DeskFloow's unified platform capabilities: front desk operations, visual tape charts, 2-way OTA distribution, automated WhatsApp booking confirmations, smart housekeeping, and revenue analytics."
      />
      <FeaturePillars />
      <FinalCta />
    </>
  );
}
