"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Phone, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { NAV_LINKS, telHref, type SiteSocial } from "@/lib/site";
import { TopSocialLinks } from "@/components/public/social-icons";

type SiteHeaderProps = {
  academyName: string;
  phone: string;
  whatsapp: string;
  morningHours: string;
  eveningHours: string;
  tagline: string;
  social: SiteSocial;
};

export function SiteHeader({
  academyName,
  phone,
  whatsapp,
  morningHours,
  eveningHours,
  tagline,
  social,
}: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Top utility bar — Laundrylite-style */}
      <div className="hidden bg-[#1a1f1c] text-white sm:block">
        <div className="mx-auto flex h-9 max-w-6xl items-center justify-between gap-4 px-4 text-xs sm:px-6">
          <div className="flex items-center gap-4 text-white/90">
            <a
              href={telHref(phone)}
              className="inline-flex items-center gap-1.5 font-medium hover:text-vmk-lime"
            >
              <Phone className="size-3.5" aria-hidden />
              {phone}
            </a>
            <span className="inline-flex items-center gap-1.5 text-white/70">
              <Clock className="size-3.5" aria-hidden />
              {morningHours} · {eveningHours}
            </span>
          </div>
          <p className="hidden items-center gap-1.5 font-medium text-vmk-lime md:inline-flex">
            {tagline}
          </p>
          <div className="flex items-center gap-2">
            <TopSocialLinks social={social} whatsapp={whatsapp} />
          </div>
        </div>
      </div>

      {/* Main white nav — high contrast */}
      <div
        className={cn(
          "border-b border-black/5 bg-white transition-shadow duration-300",
          scrolled || open ? "shadow-md" : "shadow-sm"
        )}
      >
        <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2.5"
            onClick={() => setOpen(false)}
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-vmk-green font-display text-sm font-bold text-vmk-lime">
              VK
            </span>
            <span className="min-w-0">
              <span className="block font-display text-lg font-bold leading-none text-vmk-green sm:text-xl">
                {academyName.replace(" Tennis Academy", "")}
                <span className="text-vmk-green"> Tennis</span>
              </span>
              <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-vmk-green/60">
                Academy · VMKTA
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-vmk-green/80 transition hover:bg-vmk-green/5 hover:text-vmk-green"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#book-trial"
              className={cn(
                buttonVariants({ size: "lg" }),
                "ml-3 h-11 gap-1.5 rounded-full bg-vmk-green px-5 text-sm font-bold text-white shadow-sm hover:bg-vmk-green/90"
              )}
            >
              Book Free Trial
              <ArrowRight className="size-4" />
            </a>
          </nav>

          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-xl border border-vmk-green/15 bg-vmk-green/5 text-vmk-green xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        <div
          id="mobile-nav"
          className={cn("border-t border-black/5 bg-white xl:hidden", open ? "block" : "hidden")}
        >
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-3 text-base font-semibold text-vmk-green hover:bg-vmk-green/5"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#book-trial"
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-2 h-12 justify-center gap-2 rounded-full bg-vmk-green font-bold text-white"
              )}
              onClick={() => setOpen(false)}
            >
              Book Free Trial
              <ArrowRight className="size-4" />
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
