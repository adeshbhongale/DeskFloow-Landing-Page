"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus } from "lucide-react";
import { SectionHeading, Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const faqItems = [
  {
    question: "What is DeskFloow?",
    answer:
      "DeskFloow is an intelligent hotel property management platform designed to bring front-desk operations, reservations, room management, housekeeping, guest profiles, billing, and guest communication into one connected workspace.",
  },
  {
    question: "Can DeskFloow manage reservations from multiple OTAs?",
    answer:
      "DeskFloow is designed to centralize reservations from supported booking channels and direct booking sources. Actual channel availability and synchronization depend on the integrations configured for your property.",
  },
  {
    question: "Does DeskFloow support direct bookings?",
    answer:
      "Yes. DeskFloow includes a direct booking experience concept that helps hotels accept reservations through their own booking links and website, subject to the booking engine and payment configuration available to the property.",
  },
  {
    question: "Can I send booking confirmations through WhatsApp?",
    answer:
      "DeskFloow is designed to support guest communication workflows such as booking confirmations, pre-arrival messages, check-in instructions, and service updates. Actual WhatsApp delivery requires a configured and authorized WhatsApp Business integration.",
  },
  {
    question: "Does DeskFloow include housekeeping management?",
    answer:
      "Yes. DeskFloow provides room-status and housekeeping workflow capabilities for tracking room readiness, cleaning progress, dirty rooms, and out-of-order rooms.",
  },
  {
    question: "Can I manage multiple hotel properties?",
    answer:
      "DeskFloow is designed to support multi-property workflows so authorized users can switch between properties and manage the relevant operational information according to their access permissions.",
  },
  {
    question: "Can DeskFloow manage restaurant and room-service orders?",
    answer:
      "DeskFloow can present and manage connected order workflows, including order status, room association, guest details, and service updates. Availability of external POS integrations depends on the configured implementation.",
  },
  {
    question: "Does DeskFloow support guest profiles and stay history?",
    answer:
      "Yes. The platform is designed to organize guest information, reservation history, preferences, and relevant operational details in one place, subject to the property's configuration and data permissions.",
  },
  {
    question: "Can I track hotel occupancy and revenue?",
    answer:
      "DeskFloow provides dashboard and analytics capabilities for reviewing occupancy, arrivals, departures, booking sources, and financial performance based on the data available in the system.",
  },
  {
    question: "Is DeskFloow suitable for small hotels and large properties?",
    answer:
      "DeskFloow is designed for independent hotels, boutique properties, resorts, and multi-property hospitality businesses. The appropriate configuration depends on your property's operational requirements.",
  },
  {
    question: "Can I see how DeskFloow works before using it?",
    answer:
      "Yes. Visitors can explore the available product demonstration or contact the DeskFloow team to arrange a walkthrough.",
  },
  {
    question: "How can I contact DeskFloow?",
    answer:
      "Use the Contact Us button in the navigation to reach the DeskFloow team for product information, onboarding questions, and demonstration requests.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative bg-gradient-to-b from-white via-brand-50/40 to-white py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          align="center"
          eyebrow="Support & Clarity"
          title="Frequently Asked Questions"
          lead="Everything you need to know about managing your hotel with DeskFloow."
        />

        <Reveal delay={0.08} className="mx-auto mt-14 max-w-3xl">
          <div className="divide-y divide-brand-200/70 overflow-hidden rounded-3xl border border-brand-200/80 bg-white shadow-lift ring-1 ring-brand-100/70">
            {faqItems.map((item, idx) => {
              const isOpen = openIndex === idx;
              const buttonId = `faq-question-${idx}`;
              const panelId = `faq-answer-${idx}`;

              return (
                <div
                  key={item.question}
                  className={cn(
                    "transition-colors duration-200",
                    isOpen ? "bg-brand-50/45" : "bg-white hover:bg-brand-50/25",
                  )}
                >
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500 sm:gap-4 sm:px-7 sm:py-5.5"
                    >
                      <span className="flex items-center gap-2.5 sm:gap-3.5">
                        <span
                          className={cn(
                            "inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[11.5px] font-bold transition-colors",
                            isOpen
                              ? "bg-gold-400 text-brand-950"
                              : "bg-brand-100 text-brand-700",
                          )}
                          aria-hidden
                        >
                          {idx + 1}
                        </span>
                        <span
                          className={cn(
                            "text-[15px] font-semibold tracking-tight sm:text-[17px]",
                            isOpen ? "text-brand-800" : "text-ink",
                          )}
                        >
                          {item.question}
                        </span>
                      </span>

                      <span
                        className={cn(
                          "grid size-7 sm:size-8 shrink-0 place-items-center rounded-full border transition-all duration-200",
                          isOpen
                            ? "border-brand-600 bg-brand-600 text-white shadow-2xs"
                            : "border-brand-200 bg-white text-brand-700",
                        )}
                        aria-hidden
                      >
                        {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
                      </span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pl-12 text-[14px] sm:text-[15px] leading-relaxed text-muted-foreground sm:px-7 sm:pb-6 sm:pl-[66px]">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

