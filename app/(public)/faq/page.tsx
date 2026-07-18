import type { Metadata } from "next";
import { getPublicFaqs, getSiteSettings } from "@/lib/site-content";
import { FaqSection } from "@/components/public/faq-section";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about programs, trials, fees, and parent policies at VMK Tennis Academy.",
};

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const [faqs, settings] = await Promise.all([
    getPublicFaqs(),
    getSiteSettings(),
  ]);

  return (
    <main>
      <div className="border-b border-vmk-green/10 bg-[linear-gradient(135deg,#eef5f1_0%,#fafaf7_55%,#f3f8e8_100%)] py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-vmk-green">
            {settings.academyName}
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-vmk-ink sm:text-5xl">
            Frequently asked questions
          </h1>
          <p className="mt-3 text-muted-foreground">
            Everything you need to know before stepping on court. Still unsure?{" "}
            <a href="/#contact" className="font-medium text-vmk-green underline-offset-4 hover:underline">
              Contact us
            </a>
            .
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="/#book-trial"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-vmk-green text-white hover:bg-vmk-green/90"
              )}
            >
              Book free trial
            </a>
            <a
              href="/"
              className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
            >
              Back to home
            </a>
          </div>
        </div>
      </div>
      <FaqSection faqs={faqs} />
    </main>
  );
}
