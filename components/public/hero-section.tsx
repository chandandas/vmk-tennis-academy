"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ChevronDown,
  Clock,
  Star,
  Users,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { SiteHero } from "@/lib/site";
import { MEDIA } from "@/lib/media";

type HeroSectionProps = {
  academyName: string;
  hero: SiteHero;
  reviewCount: number;
  rating: number;
  reviewsUrl: string;
};

const HIGHLIGHTS = [
  {
    icon: Clock,
    title: "Morning & evening batches",
    body: "6–10 AM and 4–7 PM windows — pick what fits your family.",
    cta: { href: "#schedule", label: "See schedule" },
  },
  {
    icon: Users,
    title: "Small groups, real coaching",
    body: "Low student-to-coach ratio so every player gets attention.",
    cta: { href: "#coaches", label: "Meet coaches" },
  },
  {
    icon: Trophy,
    title: "Path to competition",
    body: "From first racquet to tournament prep — structured by level.",
    cta: { href: "#programs", label: "View programs" },
  },
] as const;

const QUICK_CHIPS = [
  { href: "#book-trial", label: "Ages 5+" },
  { href: "#schedule", label: "Morning slots" },
  { href: "#schedule", label: "Evening slots" },
  { href: "#pricing", label: "Clear fees" },
] as const;

export function HeroSection({
  academyName,
  hero,
  reviewCount,
  rating,
  reviewsUrl,
}: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [useVideo, setUseVideo] = useState(false);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    const slow =
      connection?.saveData ||
      connection?.effectiveType === "slow-2g" ||
      connection?.effectiveType === "2g";

    if (reduced || slow) {
      setUseVideo(false);
      return;
    }

    let cancelled = false;
    const probe = async () => {
      try {
        const res = await fetch(hero.videoUrl, { method: "HEAD" });
        if (!cancelled && res.ok) setUseVideo(true);
      } catch {
        // poster only
      }
    };

    const id = window.setTimeout(probe, 800);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [hero.videoUrl]);

  useEffect(() => {
    if (useVideo && videoRef.current) {
      void videoRef.current.play().catch(() => setUseVideo(false));
    }
  }, [useVideo]);

  useEffect(() => {
    if (paused) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % HIGHLIGHTS.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [paused]);

  const highlight = HIGHLIGHTS[active];
  const Icon = highlight.icon;

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-vmk-green pt-[6.5rem] sm:pt-[7.75rem]"
    >
      <div className="absolute inset-0">
        <Image
          src={MEDIA.hero}
          alt={MEDIA.heroAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover scale-105 animate-hero-ken"
        />
        {useVideo && (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            poster={MEDIA.hero}
            muted
            loop
            playsInline
            autoPlay
            preload="none"
            aria-hidden
          >
            <source src={hero.videoUrl} type="video/mp4" />
          </video>
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-vmk-green via-vmk-green/90 to-vmk-green/35"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-vmk-green/90 via-transparent to-black/30"
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12 lg:py-16">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-vmk-lime px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-vmk-ink shadow-md">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-vmk-ink/40" />
              <span className="relative inline-flex size-2 rounded-full bg-vmk-ink" />
            </span>
            Free trial class available
          </span>

          <h1 className="mt-5 max-w-xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
            {hero.headline}
          </h1>
          <p className="mt-4 max-w-lg text-lg font-medium leading-relaxed text-white/95 sm:text-xl">
            {hero.subheading}
          </p>
          <p className="mt-2 text-sm font-semibold text-vmk-lime">
            {academyName} · Certified coaches · All levels
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {QUICK_CHIPS.map((chip) => (
              <a
                key={chip.label}
                href={chip.href}
                className="rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:border-vmk-lime hover:bg-vmk-lime hover:text-vmk-ink"
              >
                {chip.label}
              </a>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#book-trial"
              className={cn(
                buttonVariants({ size: "lg" }),
                "group h-12 gap-2 rounded-full bg-vmk-lime px-7 text-base font-bold text-vmk-ink shadow-lg transition hover:bg-white hover:shadow-xl"
              )}
            >
              Book Free Trial Class
              <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
            </a>
            <a
              href="#enquire"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 rounded-full bg-white px-7 text-base font-bold text-vmk-green shadow-lg transition hover:scale-[1.02] hover:bg-vmk-cream"
              )}
            >
              Enquire Now
            </a>
          </div>

          <a
            href={reviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-white px-4 py-2.5 text-sm text-vmk-ink shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span className="flex text-[#f5b301]" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-3.5 fill-current" />
              ))}
            </span>
            <span className="font-bold">
              {rating.toFixed(1)} · {reviewCount}+ Google Reviews
            </span>
          </a>
        </div>

        {/* Interactive highlight card */}
        <div
          className="relative animate-fade-up animation-delay-200"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/25 bg-white/10 p-2.5 shadow-2xl backdrop-blur-md transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]">
            <div className="relative aspect-[5/4] overflow-hidden rounded-2xl sm:aspect-[4/3] lg:aspect-[5/4]">
              <Image
                src={MEDIA.hero}
                alt={MEDIA.heroAlt}
                fill
                sizes="(max-width:1024px) 100vw, 40vw"
                className="object-cover transition duration-700 hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white p-4 shadow-xl sm:bottom-5 sm:left-5 sm:right-5 sm:p-5">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-vmk-green text-vmk-lime">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg font-bold text-vmk-green">
                    {highlight.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {highlight.body}
                  </p>
                  <a
                    href={highlight.cta.href}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-vmk-green hover:text-vmk-green/80"
                  >
                    {highlight.cta.label}
                    <ArrowRight className="size-3.5" />
                  </a>
                </div>
              </div>

              <div
                className="mt-4 flex items-center justify-center gap-2"
                role="tablist"
                aria-label="Highlights"
              >
                {HIGHLIGHTS.map((item, i) => (
                  <button
                    key={item.title}
                    type="button"
                    role="tab"
                    aria-selected={i === active}
                    aria-label={item.title}
                    onClick={() => setActive(i)}
                    className={cn(
                      "h-2 rounded-full transition-all",
                      i === active
                        ? "w-7 bg-vmk-green"
                        : "w-2 bg-vmk-green/25 hover:bg-vmk-green/50"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-xs font-semibold uppercase tracking-wider text-white/80 transition hover:text-vmk-lime"
        aria-label="Scroll to about section"
      >
        Explore
        <ChevronDown className="size-5 animate-bounce" />
      </a>
    </section>
  );
}
