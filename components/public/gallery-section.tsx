"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MEDIA } from "@/lib/media";

type GalleryItem = {
  id: string;
  title: string | null;
  imageUrl: string;
  category: string;
  altText: string | null;
};

const CATEGORIES = ["ALL", "TRAINING", "TOURNAMENTS", "EVENTS", "FACILITIES"] as const;

type GallerySectionProps = {
  items: GalleryItem[];
};

export function GallerySection({ items }: GallerySectionProps) {
  const photos: GalleryItem[] =
    items.length > 0
      ? items
      : MEDIA.gallery.map((g) => ({
          id: g.id,
          title: g.title,
          imageUrl: g.imageUrl,
          category: g.category,
          altText: g.altText,
        }));

  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>("ALL");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const filtered = useMemo(
    () =>
      filter === "ALL"
        ? photos
        : photos.filter((p) => p.category === filter),
    [photos, filter]
  );

  return (
    <section id="gallery" className="scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-vmk-green">
            Gallery
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-vmk-ink sm:text-4xl">
            Life at the academy
          </h2>
        </div>

        <div
          className="mt-8 flex flex-wrap justify-center gap-2"
          role="tablist"
          aria-label="Gallery categories"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={filter === cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition",
                filter === cat
                  ? "bg-vmk-green text-white"
                  : "bg-secondary text-vmk-green hover:bg-vmk-green/10"
              )}
            >
              {cat.charAt(0) + cat.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              className="mb-4 block w-full break-inside-avoid overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vmk-green"
              onClick={() => setLightbox(item)}
            >
              <Image
                src={item.imageUrl}
                alt={item.altText ?? item.title ?? "Academy gallery"}
                width={800}
                height={600}
                className="h-auto w-full object-cover transition duration-300 hover:scale-[1.02]"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          role="dialog"
          aria-modal
          aria-label={lightbox.title ?? "Gallery image"}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setLightbox(null)}
          onKeyDown={(e) => e.key === "Escape" && setLightbox(null)}
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={() => setLightbox(null)}
          >
            <X className="size-6" />
          </button>
          <Image
            src={lightbox.imageUrl}
            alt={lightbox.altText ?? lightbox.title ?? "Gallery image"}
            width={1400}
            height={900}
            className="max-h-[85vh] w-auto max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
