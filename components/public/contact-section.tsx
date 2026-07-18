import { MapPin, Phone, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { SiteSettingsMap } from "@/lib/site";
import { telHref, whatsappHref } from "@/lib/site";
import { TrialBookingForm } from "@/components/public/trial-booking-form";
import { EnquiryForm } from "@/components/public/enquiry-form";

type ContactSectionProps = {
  settings: SiteSettingsMap;
  programOptions: { name: string; slug: string }[];
};

export function ContactSection({
  settings,
  programOptions,
}: ContactSectionProps) {
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`;

  return (
    <section id="contact" className="scroll-mt-20 bg-secondary/40 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-vmk-green">
            Visit &amp; connect
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-vmk-ink sm:text-4xl">
            Come see the courts
          </h2>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="overflow-hidden border border-border bg-white">
            <iframe
              title="VMK Tennis Academy location"
              src={settings.mapEmbedUrl}
              className="h-64 w-full border-0 sm:h-80"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="space-y-4 p-6">
              <p className="flex gap-3 text-sm text-vmk-ink">
                <MapPin className="mt-0.5 size-5 shrink-0 text-vmk-green" aria-hidden />
                {settings.address}
              </p>
              <p className="flex gap-3 text-sm">
                <Phone className="mt-0.5 size-5 shrink-0 text-vmk-green" aria-hidden />
                <a
                  href={telHref(settings.phone)}
                  className="font-medium text-vmk-green hover:underline"
                >
                  {settings.phone}
                </a>
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "bg-vmk-green text-white hover:bg-vmk-green/90"
                  )}
                >
                  <Navigation className="size-4" />
                  Get Directions
                </a>
                <a
                  href={whatsappHref(settings.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" }),
                    "border-vmk-green text-vmk-green"
                  )}
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <TrialBookingForm programOptions={programOptions} />
            <EnquiryForm programOptions={programOptions} />
          </div>
        </div>
      </div>
    </section>
  );
}
