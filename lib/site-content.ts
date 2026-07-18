import { db } from "@/lib/db";
import type { SiteSettingsMap } from "@/lib/site";

export type {
  SiteSocial,
  SiteHero,
  SiteAbout,
  WhyChooseItem,
  ScheduleWindows,
  SiteSettingsMap,
} from "@/lib/site";

export { NAV_LINKS, whatsappHref, telHref } from "@/lib/site";

const defaults: SiteSettingsMap = {
  academyName: "VMK Tennis Academy",
  tagline: "Build Champions On & Off the Court",
  address: "VMK Tennis Academy, [Your Address], City, State PIN",
  phone: "+919876543210",
  whatsapp: "+919876543210",
  email: "hello@vmkta.com",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.0!2d78.4!3d17.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDI0JzAwLjAiTiA3OMKwMjQnMDAuMCJF!5e0!3m2!1sen!2sin!4v1",
  googleReviewsUrl: "https://g.page/r/PLACEHOLDER",
  googleReviewCount: 128,
  googleRating: 4.9,
  social: {
    instagram: "https://instagram.com/vmkta",
    youtube: "https://youtube.com/@vmkta",
    facebook: "https://facebook.com/vmkta",
  },
  scheduleWindows: {
    morning: { label: "Morning", start: "06:00", end: "10:00" },
    evening: { label: "Evening", start: "16:00", end: "19:00" },
  },
    hero: {
      headline: "Build Champions On & Off the Court",
      subheading: "Professional Tennis Coaching for Kids, Juniors & Adults",
      videoUrl: "/videos/hero.mp4",
      posterUrl: "/images/hero-poster.jpg",
    },
  about: {
    story:
      "VMK Tennis Academy was founded to make professional coaching accessible — building champions on and off the court.",
    mission:
      "Develop skilled, confident, and sportsperson-like individuals through structured tennis training.",
    yearsOperating: 8,
    studentsTrained: 500,
    tournamentsWon: 45,
    courts: 2,
  },
  whyChoose: [],
  notificationEmails: ["admin@vmkta.com"],
};

function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export async function getSiteSettings(): Promise<SiteSettingsMap> {
  const rows = await db.siteSetting.findMany();
  const map: SiteSettingsMap = { ...defaults };

  for (const row of rows) {
    switch (row.key) {
      case "academyName":
      case "tagline":
      case "address":
      case "phone":
      case "whatsapp":
      case "email":
      case "mapEmbedUrl":
      case "googleReviewsUrl":
        map[row.key] = parseJson(row.value, defaults[row.key]);
        break;
      case "googleReviewCount":
      case "googleRating":
        map[row.key] = parseJson(row.value, defaults[row.key]);
        break;
      case "social":
        map.social = parseJson(row.value, defaults.social);
        break;
      case "scheduleWindows":
        map.scheduleWindows = parseJson(row.value, defaults.scheduleWindows);
        break;
      case "hero":
        map.hero = parseJson(row.value, defaults.hero);
        break;
      case "about":
        map.about = parseJson(row.value, defaults.about);
        break;
      case "whyChoose":
        map.whyChoose = parseJson(row.value, defaults.whyChoose);
        break;
      case "notificationEmails":
        map.notificationEmails = parseJson(
          row.value,
          defaults.notificationEmails
        );
        break;
      default:
        break;
    }
  }

  return map;
}

export async function getPublicPrograms() {
  return db.program.findMany({
    where: { isPublished: true },
    include: {
      feePlans: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
    },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getPublicCoaches() {
  return db.coach.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getPublicTestimonials() {
  return db.testimonial.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getPublicFaqs() {
  return db.faq.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getPublicGallery() {
  return db.galleryItem.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getPublicBatches() {
  return db.batch.findMany({
    where: { isActive: true },
    include: {
      program: true,
      coach: true,
    },
    orderBy: [{ timeSlot: "asc" }, { startTime: "asc" }],
  });
}
