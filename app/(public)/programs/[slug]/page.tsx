import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const program = await db.program.findUnique({
    where: { slug: params.slug },
  });
  if (!program) return { title: "Program" };
  return {
    title: program.name,
    description: program.description ?? undefined,
  };
}

export const dynamic = "force-dynamic";

export default async function ProgramDetailPage({ params }: Props) {
  const program = await db.program.findFirst({
    where: { slug: params.slug, isPublished: true },
    include: {
      feePlans: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
      batches: {
        where: { isActive: true },
        include: { coach: true },
        orderBy: { startTime: "asc" },
      },
    },
  });

  if (!program) notFound();

  return (
    <main className="bg-background pt-36 pb-20 sm:pt-40">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link
          href="/#programs"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-vmk-green hover:underline"
        >
          <ArrowLeft className="size-4" />
          All programs
        </Link>

        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-vmk-green">
          Program
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-vmk-ink">
          {program.name}
        </h1>
        {program.ageGroup && (
          <p className="mt-2 text-lg text-muted-foreground">{program.ageGroup}</p>
        )}
        {program.description && (
          <p className="mt-6 text-lg leading-relaxed text-vmk-ink/80">
            {program.description}
          </p>
        )}

        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          {program.focusAreas && (
            <div className="border-l-2 border-vmk-lime pl-4">
              <dt className="text-sm font-medium text-muted-foreground">Focus areas</dt>
              <dd className="mt-1 text-vmk-ink">{program.focusAreas}</dd>
            </div>
          )}
          {program.sessionsPerWeek != null && (
            <div className="border-l-2 border-vmk-lime pl-4">
              <dt className="text-sm font-medium text-muted-foreground">
                Sessions / week
              </dt>
              <dd className="mt-1 text-vmk-ink">{program.sessionsPerWeek}</dd>
            </div>
          )}
        </dl>

        {program.curriculum && (
          <div className="mt-12">
            <h2 className="font-display text-2xl font-bold text-vmk-green">
              Curriculum
            </h2>
            <div className="mt-4 whitespace-pre-line text-muted-foreground leading-relaxed">
              {program.curriculum}
            </div>
          </div>
        )}

        {program.feePlans.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-2xl font-bold text-vmk-green">
              Fees
            </h2>
            <ul className="mt-4 space-y-3">
              {program.feePlans.map((plan) => (
                <li
                  key={plan.id}
                  className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border py-3"
                >
                  <span className="font-medium">{plan.name}</span>
                  <span className="font-display text-xl font-bold text-vmk-green">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    }).format(plan.amountInr)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {program.batches.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-2xl font-bold text-vmk-green">
              Current batches
            </h2>
            <ul className="mt-4 divide-y divide-border border border-border">
              {program.batches.map((batch) => (
                <li key={batch.id} className="px-4 py-3 text-sm">
                  <p className="font-medium text-vmk-ink">{batch.name}</p>
                  <p className="text-muted-foreground">
                    {batch.timeSlot === "MORNING" ? "Morning" : "Evening"} ·{" "}
                    {batch.startTime}–{batch.endTime}
                    {batch.coach ? ` · ${batch.coach.name}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <a
          href="/#book-trial"
          className={cn(
            buttonVariants({ size: "lg" }),
            "mt-10 bg-vmk-lime text-vmk-lime-foreground hover:bg-vmk-lime/90"
          )}
        >
          Book Free Trial
        </a>
      </div>
    </main>
  );
}
