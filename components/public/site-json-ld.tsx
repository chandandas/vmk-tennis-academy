import type { SiteSettingsMap } from "@/lib/site";

type JsonLdProps = {
  settings: SiteSettingsMap;
  faqs: { question: string; answer: string }[];
};

export function SiteJsonLd({ settings, faqs }: JsonLdProps) {
  const sportsLocation = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: settings.academyName,
    description: settings.tagline,
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://vmkta.com",
    telephone: settings.phone,
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressCountry: "IN",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: settings.scheduleWindows.morning.start,
        closes: settings.scheduleWindows.morning.end,
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: settings.scheduleWindows.evening.start,
        closes: settings.scheduleWindows.evening.end,
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: settings.googleRating,
      reviewCount: settings.googleReviewCount,
    },
    sameAs: Object.values(settings.social).filter(Boolean),
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sportsLocation) }}
      />
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
        />
      )}
    </>
  );
}
