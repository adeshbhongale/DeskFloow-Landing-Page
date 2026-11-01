import { Hero } from "@/components/marketing/hero";
import { ValueStrip } from "@/components/marketing/value-strip";
import { BookingJourney } from "@/components/marketing/booking-journey";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Comparison } from "@/components/marketing/comparison";
import { Testimonials } from "@/components/marketing/testimonials";
import { FinalCta } from "@/components/marketing/final-cta";
import { Faq } from "@/components/marketing/faq";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueStrip />
      <BookingJourney />
      <HowItWorks />
      <Comparison />
      <Testimonials />
      <FinalCta />
      <Faq />
    </>
  );
}
