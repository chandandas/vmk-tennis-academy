import {
  Award,
  BookOpen,
  Users,
  Video,
  Brain,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import type { SiteAbout, WhyChooseItem } from "@/lib/site";
import { StatCounter } from "@/components/public/stat-counter";

const ICONS: Record<string, LucideIcon> = {
  award: Award,
  book: BookOpen,
  users: Users,
  video: Video,
  brain: Brain,
  trophy: Trophy,
};

type AboutSectionProps = {
  about: SiteAbout;
};

export function AboutSection({ about }: AboutSectionProps) {
  return (
    <section id="about" className="scroll-mt-20 bg-vmk-green py-20 text-white sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-vmk-lime">
              About VMKTA
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Where discipline meets passion
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/80">
              {about.story}
            </p>
            <p className="mt-4 text-base leading-relaxed text-white/70">
              <span className="font-semibold text-vmk-lime">Our mission: </span>
              {about.mission}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <StatCounter value={about.studentsTrained} label="Students coached" />
            <StatCounter value={about.tournamentsWon} label="Tournaments won" />
            <StatCounter
              value={about.yearsOperating}
              label="Years of experience"
              suffix="+"
            />
            <StatCounter
              value={about.courts}
              label="Courts & facilities"
              suffix=""
            />
          </div>
        </div>
      </div>
    </section>
  );
}

type WhyChooseSectionProps = {
  items: WhyChooseItem[];
};

export function WhyChooseSection({ items }: WhyChooseSectionProps) {
  return (
    <section id="why-vmk" className="scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-vmk-green">
            Why choose VMK
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-vmk-ink sm:text-4xl">
            Coaching that builds more than strokes
          </h2>
          <p className="mt-3 text-muted-foreground">
            A complete pathway — technique, fitness, mindset, and competition.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const Icon = ICONS[item.icon] ?? Award;
            return (
              <div key={item.title} className="group">
                <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-vmk-green text-vmk-lime transition group-hover:scale-105">
                  <Icon className="size-6" aria-hidden />
                </div>
                <h3 className="font-display text-lg font-semibold text-vmk-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
