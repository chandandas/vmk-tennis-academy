"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

type Testimonial = {
  id: string;
  studentName: string;
  achievement: string | null;
  quote: string;
  parentName: string | null;
};

type SuccessStoriesProps = {
  testimonials: Testimonial[];
};

export function SuccessStoriesSection({ testimonials }: SuccessStoriesProps) {
  const [index, setIndex] = useState(0);
  const total = testimonials.length;

  useEffect(() => {
    if (total < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, 6000);
    return () => window.clearInterval(id);
  }, [total]);

  if (total === 0) return null;

  const current = testimonials[index];

  return (
    <section
      id="success"
      className="scroll-mt-20 bg-vmk-green py-20 text-white sm:py-24"
    >
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-vmk-lime">
          Success stories
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Champions in the making
        </h2>

        <div className="relative mt-12">
          <Quote
            className="mx-auto size-10 text-vmk-lime/40"
            aria-hidden
          />
          <blockquote className="mt-4 font-display text-xl leading-relaxed sm:text-2xl">
            “{current.quote}”
          </blockquote>
          <footer className="mt-6">
            <p className="font-semibold text-vmk-lime">{current.studentName}</p>
            {current.achievement && (
              <p className="mt-1 text-sm text-white/70">{current.achievement}</p>
            )}
            {current.parentName && (
              <p className="mt-1 text-sm text-white/50">
                — {current.parentName}, parent
              </p>
            )}
          </footer>

          {total > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                type="button"
                aria-label="Previous story"
                className="rounded-full border border-white/20 p-2 hover:bg-white/10"
                onClick={() => setIndex((i) => (i - 1 + total) % total)}
              >
                <ChevronLeft className="size-5" />
              </button>
              <div className="flex gap-1.5" role="tablist" aria-label="Stories">
                {testimonials.map((t, i) => (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Show story ${i + 1}`}
                    className={cn(
                      "size-2 rounded-full transition",
                      i === index ? "bg-vmk-lime" : "bg-white/30"
                    )}
                    onClick={() => setIndex(i)}
                  />
                ))}
              </div>
              <button
                type="button"
                aria-label="Next story"
                className="rounded-full border border-white/20 p-2 hover:bg-white/10"
                onClick={() => setIndex((i) => (i + 1) % total)}
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
