import Link from "next/link";
import {
  ArrowRight,
  ClipboardCheck,
  Route,
  Users,
} from "lucide-react";
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

/** Extra marketing copy keyed by slug (DB keeps core fields). */
const PROGRAM_DETAILS: Record<
  string,
  { level: string; outcomes: string[]; idealFor: string }
> = {
  beginner: {
    level: "Level 1",
    idealFor: "First-timers and young players new to the racquet",
    outcomes: [
      "Grip, stance, and safe court habits",
      "Fun coordination & footwork games",
      "Short rallies with confidence",
    ],
  },
  intermediate: {
    level: "Level 2",
    idealFor: "Players who can rally and want consistency",
    outcomes: [
      "Reliable forehand & backhand",
      "Court positioning & recovery",
      "Intro to serve and point play",
    ],
  },
  "semi-advanced": {
    level: "Level 3",
    idealFor: "Juniors ready for competitive drills",
    outcomes: [
      "Spin, depth, and directional control",
      "Match tactics & structured sparring",
      "Fitness habits for match day",
    ],
  },
  "advanced-performance": {
    level: "Level 4",
    idealFor: "Tournament-bound juniors seeking peak form",
    outcomes: [
      "Periodized training & ranking goals",
      "Mental conditioning & video feedback",
      "Tournament prep with coach support",
    ],
  },
  "adult-program": {
    level: "Adults",
    idealFor: "Adults of all levels — learn, improve, stay active",
    outcomes: [
      "Technique clinics for every level",
      "Cardio tennis & social match play",
      "Flexible slots that fit work life",
    ],
  },
};

const PATHWAY = [
  { label: "Beginner", hint: "First racquet" },
  { label: "Intermediate", hint: "Consistency" },
  { label: "Semi-Advanced", hint: "Compete" },
  { label: "Advanced", hint: "Tournaments" },
  { label: "Adults", hint: "All levels" },
];

const PLACEMENT = [
  {
    icon: ClipboardCheck,
    title: "Free trial assessment",
    body: "One session with a coach to see age, ability, and goals — no pressure to enrol.",
  },
  {
    icon: Route,
    title: "Placed in the right batch",
    body: "We match you to a level and time slot so every player gets the right pace of challenge.",
  },
  {
    icon: Users,
    title: "Small groups, real attention",
    body: "Batches stay intentionally small for personalized coaching and individual feedback.",
  },
];

export function ProgramsSection({ programs }: ProgramsSectionProps) {
  const list = programs.length > 0 ? programs : [];

  return (
    <section
      id="programs"
      className="scroll-mt-20 bg-[linear-gradient(180deg,#eef5f1_0%,#fafaf7_45%,#fafaf7_100%)] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-vmk-green">
            Programs
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-vmk-ink sm:text-4xl md:text-5xl">
            Find the right level for every player
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            From first racquet to tournament pathway — structured by age and
            ability. Kids, juniors, and adults train in clear levels so progress
            is measurable, sessions stay focused, and every player belongs in
            the right group.
          </p>
        </div>

        {/* Pathway strip */}
        <div className="mt-12 overflow-x-auto pb-2">
          <ol className="mx-auto flex min-w-[36rem] max-w-4xl items-stretch justify-between gap-2 sm:min-w-0">
            {PATHWAY.map((step, i) => (
              <li key={step.label} className="relative flex flex-1 flex-col items-center text-center">
                {i < PATHWAY.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute left-[calc(50%+1.25rem)] right-[calc(-50%+1.25rem)] top-5 hidden h-px bg-vmk-green/25 sm:block"
                  />
                )}
                <span className="relative z-10 flex size-10 items-center justify-center rounded-full bg-vmk-green font-display text-sm font-bold text-vmk-lime">
                  {i + 1}
                </span>
                <span className="mt-3 font-display text-sm font-semibold text-vmk-ink sm:text-base">
                  {step.label}
                </span>
                <span className="mt-0.5 text-xs text-muted-foreground">
                  {step.hint}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* How placement works */}
        <div className="mt-14 grid gap-8 border-y border-vmk-green/10 py-10 sm:grid-cols-3">
          {PLACEMENT.map((item) => (
            <div key={item.title} className="flex gap-4 sm:flex-col sm:gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-vmk-green text-vmk-lime">
                <item.icon className="size-5" aria-hidden />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-vmk-ink">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Program grid */}
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {list.map((program, index) => {
            const detail = PROGRAM_DETAILS[program.slug];
            const focusList = program.focusAreas
              ? program.focusAreas.split(",").map((s) => s.trim()).filter(Boolean)
              : [];

            return (
              <article
                key={program.id}
                className="flex flex-col border border-vmk-green/10 bg-white p-6 sm:p-8 shadow-[0_16px_48px_-28px_rgba(11,61,46,0.4)] transition hover:-translate-y-0.5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-vmk-green">
                        {detail?.level ?? `Program ${index + 1}`}
                      </span>
                      {program.sessionsPerWeek != null && (
                        <span className="rounded-md bg-vmk-green/8 px-2 py-0.5 text-xs font-medium text-vmk-green">
                          {program.sessionsPerWeek} sessions / week
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 font-display text-2xl font-bold text-vmk-ink">
                      {program.name}
                    </h3>
                    {program.ageGroup && (
                      <p className="mt-1 text-sm font-medium text-vmk-ink/65">
                        Ages {program.ageGroup}
                      </p>
                    )}
                  </div>
                </div>

                {program.description && (
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {program.description}
                  </p>
                )}

                {detail?.idealFor && (
                  <p className="mt-3 text-sm text-vmk-ink">
                    <span className="font-medium">Best for: </span>
                    <span className="text-muted-foreground">{detail.idealFor}</span>
                  </p>
                )}

                {(detail?.outcomes?.length || focusList.length > 0) && (
                  <ul className="mt-5 space-y-2 border-t border-vmk-green/10 pt-5">
                    {(detail?.outcomes ?? focusList).map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-sm text-muted-foreground"
                      >
                        <span
                          aria-hidden
                          className="mt-1.5 size-1.5 shrink-0 rounded-full bg-vmk-lime"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-auto flex flex-wrap gap-2 pt-6">
                  <a
                    href="#book-trial"
                    className={cn(
                      buttonVariants({ size: "default" }),
                      "bg-vmk-green text-white hover:bg-vmk-green/90"
                    )}
                  >
                    Book free trial
                  </a>
                  <Link
                    href={`/programs/${program.slug}`}
                    className={cn(
                      buttonVariants({ size: "default", variant: "outline" }),
                      "border-vmk-green/25 text-vmk-green hover:bg-vmk-green/5"
                    )}
                  >
                    Full curriculum
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 border border-vmk-green/15 bg-vmk-green px-6 py-10 text-center text-white sm:px-10">
          <h3 className="font-display text-2xl font-bold sm:text-3xl">
            Not sure which level fits?
          </h3>
          <p className="max-w-xl text-sm text-white/80 sm:text-base">
            Book a free trial — our coaches will place your child (or you) in
            the right program after one on-court session.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="#book-trial"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-vmk-lime text-vmk-green hover:bg-vmk-lime/90"
              )}
            >
              Book free trial
            </a>
            <a
              href="#enquire"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "border-white/30 bg-transparent text-white hover:bg-white/10"
              )}
            >
              Ask a question
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
