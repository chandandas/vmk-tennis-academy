import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type Program = {
  id: string;
  name: string;
  slug: string;
  ageGroup: string | null;
  focusAreas: string | null;
  sessionsPerWeek: number | null;
  description: string | null;
};

type ProgramsSectionProps = {
  programs: Program[];
};

export function ProgramsSection({ programs }: ProgramsSectionProps) {
  return (
    <section
      id="programs"
      className="scroll-mt-20 bg-[linear-gradient(180deg,#eef5f1_0%,#fafaf7_100%)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-vmk-green">
            Programs
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-vmk-ink sm:text-4xl">
            Find the right level for every player
          </h2>
          <p className="mt-3 text-muted-foreground">
            From first racquet to tournament pathway — structured by age and ability.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <article
              key={program.id}
              className="flex flex-col border-t-4 border-vmk-lime bg-white p-6 shadow-[0_12px_40px_-20px_rgba(11,61,46,0.35)] transition hover:-translate-y-0.5"
            >
              <h3 className="font-display text-xl font-bold text-vmk-green">
                {program.name}
              </h3>
              {program.ageGroup && (
                <p className="mt-1 text-sm font-medium text-vmk-ink/70">
                  {program.ageGroup}
                </p>
              )}
              {program.description && (
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {program.description}
                </p>
              )}
              <dl className="mt-4 space-y-1 text-sm">
                {program.focusAreas && (
                  <div>
                    <dt className="inline font-medium text-vmk-ink">Focus: </dt>
                    <dd className="inline text-muted-foreground">
                      {program.focusAreas}
                    </dd>
                  </div>
                )}
                {program.sessionsPerWeek != null && (
                  <div>
                    <dt className="inline font-medium text-vmk-ink">Sessions: </dt>
                    <dd className="inline text-muted-foreground">
                      {program.sessionsPerWeek}/week
                    </dd>
                  </div>
                )}
              </dl>
              <div className="mt-6 flex flex-wrap gap-2">
                <a
                  href="#book-trial"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "bg-vmk-green text-white hover:bg-vmk-green/90"
                  )}
                >
                  Book Free Trial
                </a>
                <Link
                  href={`/programs/${program.slug}`}
                  className={cn(
                    buttonVariants({ size: "sm", variant: "ghost" }),
                    "text-vmk-green"
                  )}
                >
                  Curriculum
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
