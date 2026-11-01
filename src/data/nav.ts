import {
  BarChart3, BedDouble, CalendarRange, Globe2, MessageCircle, Network, Sparkles, UsersRound, UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  description: string;
  icon: LucideIcon;
}

export const platformNav: NavItem[] = [
  { label: "Front Desk PMS", href: "/features#front-desk", description: "Arrivals, departures, folios and shifts", icon: BedDouble },
  { label: "Visual Tape Chart", href: "/features#tape-chart", description: "Interactive 7-day room inventory matrix", icon: CalendarRange },
  { label: "OTA Channel Manager", href: "/features#channels", description: "2-way instant sync across every channel", icon: Network },
  { label: "Direct Booking Engine", href: "/features#booking", description: "Commission-free bookings on your domain", icon: Globe2 },
  { label: "WhatsApp Confirmations", href: "/features#whatsapp", description: "Automated booking confirmation campaign service", icon: MessageCircle },
  { label: "Guest CRM & Loyalty", href: "/features#crm", description: "VIP tags, guest history and repeat stay profiles", icon: UsersRound },
  { label: "Smart Housekeeping", href: "/features#housekeeping", description: "Live room readiness and visual floor plans", icon: Sparkles },
  { label: "Restaurant & POS Orders", href: "/features#orders", description: "Contactless QR menu & room service billing", icon: UtensilsCrossed },
  { label: "Analytics & Revenue", href: "/features#analytics", description: "Real-time occupancy, ADR, RevPAR and reports", icon: BarChart3 },
];

export const mainNav = [
  { label: "Pricing", href: "/pricing" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];
