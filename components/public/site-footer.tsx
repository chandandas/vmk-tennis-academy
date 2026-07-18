import Link from "next/link";
import type { SiteSettingsMap } from "@/lib/site";
import { NAV_LINKS, telHref, whatsappHref } from "@/lib/site";

type SiteFooterProps = {
  settings: SiteSettingsMap;
  programs: { name: string; slug: string }[];
};

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="rounded-md p-2 text-white/80 transition hover:bg-white/10 hover:text-vmk-lime"
    >
      {children}
    </a>
  );
}

export function SiteFooter({ settings, programs }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-vmk-green text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-xl font-bold">
            {settings.academyName}
          </p>
          <p className="mt-2 text-sm text-white/70">{settings.tagline}</p>
          <div className="mt-4 flex gap-1">
            {settings.social.instagram && (
              <SocialLink href={settings.social.instagram} label="Instagram">
                <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9C2.4 3.9 4 2.4 7.1 2.3 8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-2.2.1-3.3 1.2-3.4 3.4-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 2.2 1.2 3.3 3.4 3.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c2.2-.1 3.3-1.2 3.4-3.4.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-2.2-1.2-3.3-3.4-3.4-1.2-.1-1.6-.1-4.7-.1zm0 3.1a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4zm5.1-.9a1.2 1.2 0 1 1 0 2.3 1.2 1.2 0 0 1 0-2.3z" />
                </svg>
              </SocialLink>
            )}
            {settings.social.youtube && (
              <SocialLink href={settings.social.youtube} label="YouTube">
                <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.8 15.5v-7l6.3 3.5-6.3 3.5z" />
                </svg>
              </SocialLink>
            )}
            {settings.social.facebook && (
              <SocialLink href={settings.social.facebook} label="Facebook">
                <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14C17.17 2.1 15.8 2 14.5 2 11.6 2 9.5 3.79 9.5 7.15V9.5H7v4h2.5V22h4v-8.5z" />
                </svg>
              </SocialLink>
            )}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-vmk-lime">
            Quick links
          </p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-vmk-lime">
            Programs
          </p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {programs.map((p) => (
              <li key={p.slug}>
                <Link href={`/programs/${p.slug}`} className="hover:text-white">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-vmk-lime">
            Contact
          </p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li>{settings.address}</li>
            <li>
              <a href={telHref(settings.phone)} className="hover:text-white">
                {settings.phone}
              </a>
            </li>
            <li>
              <a
                href={whatsappHref(settings.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${settings.email}`} className="hover:text-white">
                {settings.email}
              </a>
            </li>
            <li className="pt-1 text-white/60">
              Morning {settings.scheduleWindows.morning.start}–
              {settings.scheduleWindows.morning.end}
              <br />
              Evening {settings.scheduleWindows.evening.start}–
              {settings.scheduleWindows.evening.end}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {year} {settings.academyName}. All rights reserved.
      </div>
    </footer>
  );
}
