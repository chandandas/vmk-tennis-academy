import { Shield, MessageSquare, Route, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const POINTS = [
  {
    icon: Route,
    title: "Trial-to-enrolment journey",
    body: "Book a free trial, meet the coach, then enrol in the right batch — no pressure, clear next steps.",
  },
  {
    icon: ClipboardCheck,
    title: "Progress tracking & feedback",
    body: "Periodic coach check-ins so you know how your child is improving on and off the court.",
  },
  {
    icon: Shield,
    title: "Safety first",
    body: "Age-appropriate drills, supervised courts, and clear rain / weather policies.",
  },
  {
    icon: MessageSquare,
    title: "Always reachable",
    body: "Front desk, WhatsApp, and coach updates — communication channels parents can rely on.",
  },
];

const PARENT_FAQS = [
  {
    q: "Can I watch sessions?",
    a: "Yes — from designated viewing areas. Please avoid interrupting on-court coaching.",
  },
  {
    q: "What if my child is nervous?",
    a: "Our beginner batches are designed for first-timers. Coaches ease kids in with fun, confidence-building drills.",
  },
  {
    q: "How soon will I see progress?",
    a: "Most players show clearer technique within 4–6 weeks of consistent attendance.",
  },
];

export function ParentsSection() {
  return (
    <section
      id="parents"
      className="scroll-mt-20 bg-[linear-gradient(135deg,#eef5f1_0%,#fafaf7_50%,#f3f8e8_100%)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-vmk-green">
            For parents
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-vmk-ink sm:text-4xl">
            Peace of mind while they chase every ball
          </h2>
          <p className="mt-3 text-muted-foreground">
            Transparent process, safety, and feedback — so you know exactly what to expect.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {POINTS.map((p) => (
            <div key={p.title} className="flex gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-vmk-green text-vmk-lime">
                <p.icon className="size-5" aria-hidden />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-vmk-ink">
                  {p.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-vmk-green/10 pt-10">
          <h3 className="font-display text-xl font-bold text-vmk-green">
            Parent FAQ
          </h3>
          <dl className="mt-6 grid gap-6 md:grid-cols-3">
            {PARENT_FAQS.map((f) => (
              <div key={f.q}>
                <dt className="font-medium text-vmk-ink">{f.q}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
          <a
            href="#enquire"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-8 bg-vmk-green text-white hover:bg-vmk-green/90"
            )}
          >
            Ask us anything
          </a>
        </div>
      </div>
    </section>
  );
}
