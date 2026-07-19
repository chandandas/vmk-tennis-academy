import {
  getPublicPrograms,
  getSiteSettings,
} from "@/lib/site-content";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { WhatsAppFloat } from "@/components/public/whatsapp-float";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, programs] = await Promise.all([
    getSiteSettings(),
    getPublicPrograms(),
  ]);

  const morning = settings.scheduleWindows.morning;
  const evening = settings.scheduleWindows.evening;

  return (
    <>
      <SiteHeader
        academyName={settings.academyName}
        phone={settings.phone}
        whatsapp={settings.whatsapp}
        morningHours={`${morning.label} ${morning.start}–${morning.end}`}
        eveningHours={`${evening.label} ${evening.start}–${evening.end}`}
        tagline={settings.tagline}
        social={settings.social}
      />
      {children}
      <SiteFooter
        settings={settings}
        programs={programs.map((p) => ({ name: p.name, slug: p.slug }))}
      />
      <WhatsAppFloat
        phone={settings.whatsapp}
        academyName={settings.academyName}
        programOptions={programs.map((p) => ({
          name: p.name,
          slug: p.slug,
        }))}
      />
    </>
  );
}
