export type SiteSocial = {
  instagram?: string;
  youtube?: string;
  facebook?: string;
};

export type SiteHero = {
  headline: string;
  subheading: string;
  videoUrl: string;
  posterUrl: string;
};

export type SiteAbout = {
  story: string;
  mission: string;
  yearsOperating: number;
  studentsTrained: number;
  tournamentsWon: number;
  courts: number;
};

export type WhyChooseItem = {
  title: string;
  description: string;
  icon: string;
};

export type ScheduleWindows = {
  morning: { label: string; start: string; end: string };
  evening: { label: string; start: string; end: string };
};

export type SiteSettingsMap = {
  academyName: string;
  tagline: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  mapEmbedUrl: string;
  googleReviewsUrl: string;
  googleReviewCount: number;
  googleRating: number;
  social: SiteSocial;
  scheduleWindows: ScheduleWindows;
  hero: SiteHero;
  about: SiteAbout;
  whyChoose: WhyChooseItem[];
  notificationEmails: string[];
};

export const NAV_LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#programs", label: "Programs" },
  { href: "/#coaches", label: "Coaches" },
  { href: "/#schedule", label: "Schedule" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
] as const;

export function whatsappHref(phone: string, message?: string) {
  const digits = phone.replace(/\D/g, "");
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${text}`;
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`;
}
