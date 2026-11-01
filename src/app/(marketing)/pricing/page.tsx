import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { PricingCards } from "@/components/marketing/pricing";
import { FinalCta } from "@/components/marketing/final-cta";
import { SectionHeading } from "@/components/ui/reveal";
import { ChevronDown } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing — Boutique, Growth and Enterprise plans",
  description: "Illustrative DeskFloow pricing for independent hotels, growing resorts and multi-property groups, with a full feature comparison.",
  alternates: { canonical: "/pricing" },
};

const faqs = [
  ["Are these final prices?", "No. The prices shown are illustrative to help you evaluate fit. Final commercial rates depend on your room count, properties and integrations, and are shared during a demo."],
  ["Is there a discount for yearly billing?", "No discount is configured at the moment. The yearly figure is simply twelve months of the monthly price."],
  ["Is there a free trial?", "We don't offer a self-serve trial yet. You can explore the full interactive demo with sample data any time, and book a guided demo for your property."],
  ["Which OTAs are supported?", "OTA connections are set up per channel. The demo simulates several channels; none are live yet. Contact our team for the current connection status of each channel."],
  ["Can I use my own WhatsApp number?", "WhatsApp messaging requires your own WhatsApp Business Platform account, approved templates and guest opt-in. Until that is configured, messages remain in demo mode."],
  ["How is room count measured?", "Plans are packaged per sellable room per month. Enterprise is quoted per portfolio."],
];

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
};

export default function PricingPage() {
  return (
    <>
      <PageHero crumbs={[{ label: "Pricing" }]} eyebrow="Pricing" title="Simple packaging for every property size." lead="Illustrative pricing — final rates are confirmed with your team. No hidden promotions, no implied discounts." />
      <section className="container-x pb-20">
        <PricingCards showTable />
      </section>
      <section className="container-x pb-24">
        <SectionHeading align="center" title="Frequently asked questions" />
        <div className="mx-auto mt-10 max-w-3xl divide-y divide-line rounded-3xl border border-line bg-white">
          {faqs.map(([q, a]) => (
            <details key={q} className="group px-6 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-medium">
                {q}
                <ChevronDown className="size-4 shrink-0 text-muted-foreground transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-[14.5px] leading-relaxed text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <FinalCta />
    </>
  );
}
