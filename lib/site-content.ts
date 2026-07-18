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
  try {
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
  } catch (err) {
    console.error("[getSiteSettings] DB unavailable, using defaults:", err);
    return { ...defaults };
  }
}

/** Shown when DB has no programs or is unreachable. */
export const DEFAULT_PUBLIC_PROGRAMS = [
  {
    id: "fallback-beginner",
    name: "Beginner",
    slug: "beginner",
    ageGroup: "5–10 years",
    focusAreas: "Fundamentals, coordination, fun drills",
    sessionsPerWeek: 2,
    description:
      "Introduction to tennis for first-timers — grip, stance, and rally basics.",
    isPublished: true,
    sortOrder: 1,
    feePlans: [] as {
      id: string;
      name: string;
      interval: "MONTHLY" | "QUARTERLY";
      amountInr: number;
      inclusions: string | null;
      isPopular: boolean;
    }[],
  },
  {
    id: "fallback-intermediate",
    name: "Intermediate",
    slug: "intermediate",
    ageGroup: "8–14 years",
    focusAreas: "Stroke consistency, court positioning",
    sessionsPerWeek: 3,
    description:
      "Build consistent groundstrokes and develop match awareness.",
    isPublished: true,
    sortOrder: 2,
    feePlans: [],
  },
  {
    id: "fallback-semi",
    name: "Semi-Advanced",
    slug: "semi-advanced",
    ageGroup: "10–16 years",
    focusAreas: "Tactics, spin, competitive drills",
    sessionsPerWeek: 4,
    description:
      "Bridge to competitive play with structured match practice.",
    isPublished: true,
    sortOrder: 3,
    feePlans: [],
  },
  {
    id: "fallback-advanced",
    name: "Advanced Performance",
    slug: "advanced-performance",
    ageGroup: "12–18 years",
    focusAreas: "Tournament prep, mental game, peak fitness",
    sessionsPerWeek: 5,
    description:
      "High-performance pathway for tournament-bound juniors.",
    isPublished: true,
    sortOrder: 4,
    feePlans: [],
  },
  {
    id: "fallback-adult",
    name: "Adult Program",
    slug: "adult-program",
    ageGroup: "18+ years",
    focusAreas: "Fitness, social play, technique refresh",
    sessionsPerWeek: 2,
    description:
      "Adults of all levels — learn, improve, and stay active.",
    isPublished: true,
    sortOrder: 5,
    feePlans: [],
  },
];

export async function getPublicPrograms() {
  try {
    const rows = await db.program.findMany({
      where: { isPublished: true },
      include: {
        feePlans: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
      },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length > 0) return rows;
  } catch (err) {
    console.error("[getPublicPrograms] DB unavailable, using defaults:", err);
  }
  return DEFAULT_PUBLIC_PROGRAMS.map((p) => ({ ...p, feePlans: [...p.feePlans] }));
}

/** Shown when DB has no coaches or is unreachable. */
export const DEFAULT_PUBLIC_COACHES = [
  {
    id: "fallback-coach-vijay",
    name: "Vijay",
    photoUrl: null as string | null,
    certifications: "Head Coach · Founder, VMK Tennis Academy",
    playingBackground:
      "Founded VMK Tennis Academy to bring professional coaching to every age and level.",
    specialization: "Head Coach / Founder",
  },
  {
    id: "fallback-coach-sambhu",
    name: "Sambhu",
    photoUrl: null as string | null,
    certifications: "Senior Coach",
    playingBackground:
      "Experienced senior coach focused on technique, consistency, and competitive readiness.",
    specialization: "Senior Coach",
  },
  {
    id: "fallback-coach-kabir",
    name: "Kabir",
    photoUrl: null as string | null,
    certifications: "Coach",
    playingBackground:
      "Hands-on court coach helping beginners and developing players build confidence early.",
    specialization: "Coach",
  },
];

export async function getPublicCoaches() {
  try {
    const rows = await db.coach.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length > 0) return rows;
  } catch (err) {
    console.error("[getPublicCoaches] DB unavailable, using defaults:", err);
  }
  return DEFAULT_PUBLIC_COACHES.map((c) => ({ ...c }));
}

export async function getPublicTestimonials() {
  try {
    return await db.testimonial.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch (err) {
    console.error("[getPublicTestimonials] DB unavailable:", err);
    return [];
  }
}

/** Shown when DB has no FAQs or is unreachable (e.g. Vercel misconfigured DATABASE_URL). */
export const DEFAULT_PUBLIC_FAQS = [
  {
    id: "fallback-1",
    question: "At what age can my child start?",
    answer:
      "We welcome kids from age 5. Our Beginner program is designed for first-timers with age-appropriate drills.",
  },
  {
    id: "fallback-2",
    question: "What should we bring to the first class?",
    answer:
      "Comfortable sportswear, non-marking tennis shoes, a water bottle, and a towel. A racquet is helpful but not required for beginners.",
  },
  {
    id: "fallback-3",
    question: "Do you provide racquets?",
    answer:
      "Yes — demo racquets are available for trial classes and beginners. We can also advise on buying the right racquet later.",
  },
  {
    id: "fallback-4",
    question: "How does the free trial work?",
    answer:
      "Book a free trial online or via WhatsApp. We'll place your child in an age-appropriate batch for one session so you can experience our coaching.",
  },
  {
    id: "fallback-5",
    question: "How are fees structured?",
    answer:
      "Each program offers monthly and quarterly plans. Quarterly plans include savings and priority benefits. A free trial is available before enrolment.",
  },
  {
    id: "fallback-6",
    question: "Can we change batches later?",
    answer:
      "Yes, subject to capacity. Speak with front desk and we'll try to accommodate preferred slots and coaches.",
  },
  {
    id: "fallback-7",
    question: "What is your rain / weather policy?",
    answer:
      "Outdoor sessions cancelled due to rain are rescheduled or converted to indoor fitness/technique sessions when possible.",
  },
  {
    id: "fallback-8",
    question: "Do you support tournament participation?",
    answer:
      "Yes — especially Semi-Advanced and Advanced players. We help with tournament selection, prep, and on-court support where possible.",
  },
  {
    id: "fallback-9",
    question: "How do parents get progress updates?",
    answer:
      "Coaches share periodic feedback; parents can request check-ins. Advanced players get structured progress notes.",
  },
  {
    id: "fallback-10",
    question: "Is there a parent waiting area?",
    answer:
      "Yes — parents are welcome to watch from designated areas. Please avoid interrupting sessions on court.",
  },
] as const;

export async function getPublicFaqs() {
  try {
    const rows = await db.faq.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length > 0) return rows;
  } catch (err) {
    console.error("[getPublicFaqs] DB unavailable, using defaults:", err);
  }
  return DEFAULT_PUBLIC_FAQS.map((f) => ({ ...f }));
}

export async function getPublicGallery() {
  try {
    return await db.galleryItem.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch (err) {
    console.error("[getPublicGallery] DB unavailable:", err);
    return [];
  }
}

export async function getPublicBatches() {
  try {
    return await db.batch.findMany({
      where: { isActive: true },
      include: {
        program: true,
        coach: true,
      },
      orderBy: [{ timeSlot: "asc" }, { startTime: "asc" }],
    });
  } catch (err) {
    console.error("[getPublicBatches] DB unavailable:", err);
    return [];
  }
}
