import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/layout/providers";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DeskFloow — An Intelligent Hotel Operations Platform",
    template: "%s · DeskFloow",
  },
  description:
    "DeskFloow unifies reservations, front desk, OTA channels, direct bookings, WhatsApp guest messaging, housekeeping, room service and hotel analytics in one workspace.",
  applicationName: "DeskFloow",
  keywords: ["hotel PMS", "property management system", "channel manager", "hotel booking engine", "front desk software", "housekeeping", "WhatsApp for hotels"],
  openGraph: {
    type: "website",
    siteName: "DeskFloow",
    title: "DeskFloow — An Intelligent Hotel Operations Platform",
    description: "One intelligent platform for every room, reservation, guest and operation.",
    images: [{ url: "/images/lobby.jpg", width: 1376, height: 768, alt: "Hotel reception desk at dusk" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#7e2cf6",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}>
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-brand-700 focus:px-4 focus:py-2 focus:text-white">
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
