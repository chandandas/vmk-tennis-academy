import type { Metadata } from "next";
import {
  getPublicBatches,
  getPublicCoaches,
  getPublicFaqs,
  getPublicGallery,
  getPublicPrograms,
  getPublicTestimonials,
  getSiteSettings,
} from "@/lib/site-content";
import { HeroSection } from "@/components/public/hero-section";
import {
  AboutSection,
  WhyChooseSection,
} from "@/components/public/about-why-sections";
import { ProgramsSection } from "@/components/public/programs-section";
import { CoachesSection } from "@/components/public/coaches-section";
import { SuccessStoriesSection } from "@/components/public/success-stories";
import { GallerySection } from "@/components/public/gallery-section";
import { ParentsSection } from "@/components/public/parents-section";
import { ScheduleSection } from "@/components/public/schedule-section";
import { PricingSection } from "@/components/public/pricing-section";
import { FaqSection } from "@/components/public/faq-section";
import { ContactSection } from "@/components/public/contact-section";
import { SiteJsonLd } from "@/components/public/site-json-ld";

export const metadata: Metadata = {
  title: "Build Champions On & Off the Court",
  description:
    "Professional tennis coaching for kids, juniors & adults at VMK Tennis Academy. Book a free trial class today.",
  openGraph: {
    title: "VMK Tennis Academy",
    description:
      "Professional tennis coaching for kids, juniors & adults. Book a free trial class.",
    images: [
      {
        url: "/images/hero-poster.jpg",
        width: 1200,
        height: 630,
        alt: "VMK Tennis Academy",
      },
    ],
  },
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [
    settings,
    programs,
    coaches,
    testimonials,
    faqs,
    gallery,
    batches,
  ] = await Promise.all([
    getSiteSettings(),
    getPublicPrograms(),
    getPublicCoaches(),
    getPublicTestimonials(),
    getPublicFaqs(),
    getPublicGallery(),
    getPublicBatches(),
  ]);

  const whyChoose =
    settings.whyChoose.length > 0
      ? settings.whyChoose
      : [
          {
            title: "Certified Coaches",
            description:
              "ITF/AITA-certified coaches with competitive backgrounds.",
            icon: "award",
          },
          {
            title: "Structured Curriculum",
            description:
              "Age- and level-based pathways from beginner to performance.",
            icon: "book",
          },
          {
            title: "Low Student-to-Coach Ratio",
            description:
              "Small batches so every player gets individual attention.",
            icon: "users",
          },
          {
            title: "Video Analysis",
            description:
              "Technique feedback using video review for faster improvement.",
            icon: "video",
          },
          {
            title: "Fitness & Mental Conditioning",
            description:
              "On-court fitness and mindset training built into programs.",
            icon: "brain",
          },
          {
            title: "Tournament Exposure",
            description:
              "Guidance and support for local and state-level events.",
            icon: "trophy",
          },
        ];

  return (
    <>
      <SiteJsonLd settings={settings} faqs={faqs} />
      <main>
        <HeroSection
          academyName={settings.academyName}
          hero={settings.hero}
          reviewCount={settings.googleReviewCount}
          rating={settings.googleRating}
          reviewsUrl={settings.googleReviewsUrl}
        />
        <AboutSection about={settings.about} />
        <WhyChooseSection items={whyChoose} />
        <ProgramsSection programs={programs} />
        <CoachesSection coaches={coaches} />
        <SuccessStoriesSection testimonials={testimonials} />
        <GallerySection items={gallery} />
        <ParentsSection />
        <ScheduleSection
          windows={settings.scheduleWindows}
          batches={batches}
        />
        <PricingSection programs={programs} />
        <FaqSection faqs={faqs} />
        <ContactSection
          settings={settings}
          programOptions={programs.map((p) => ({
            name: p.name,
            slug: p.slug,
          }))}
        />
      </main>
    </>
  );
}
