import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type FeePlan = {
  id: string;
  name: string;
  interval: "MONTHLY" | "QUARTERLY";
  amountInr: number;
  inclusions: string | null;
  isPopular: boolean;
};

type ProgramWithFees = {
  id: string;
  name: string;
  slug: string;
  feePlans: FeePlan[];
};

type PricingSectionProps = {
  programs: ProgramWithFees[];
};

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function PricingSection({ programs }: PricingSectionProps) {
  return (
    <section
      id="pricing"
      className="scroll-mt-20 bg-vmk-green py-20 text-white sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-vmk-lime">
            Pricing
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Clear fees. Free trial first.
          </h2>
          <p className="mt-3 text-white/75">
            Try a class before you enrol. Monthly and quarterly plans available
            for every program.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {programs.map((program) => {
            const popular = program.feePlans.find((f) => f.isPopular);
            const plans = program.feePlans;

            return (
              <article
                key={program.id}
                className={cn(
                  "relative flex flex-col border p-6",
                  popular
                    ? "border-vmk-lime bg-white text-vmk-ink shadow-[0_0_0_1px_var(--vmk-lime)]"
                    : "border-white/15 bg-white/5"
                )}
              >
                {popular && (
                  <span className="absolute -top-3 left-6 rounded-full bg-vmk-lime px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-vmk-lime-foreground">
                    Most popular
                  </span>
                )}
                <h3
                  className={cn(
                    "font-display text-xl font-bold",
                    popular ? "text-vmk-green" : "text-white"
                  )}
                >
                  {program.name}
                </h3>
                <ul className="mt-5 flex-1 space-y-4">
                  {plans.map((plan) => (
                    <li key={plan.id}>
                      <div className="flex items-baseline justify-between gap-2">
                        <span
                          className={cn(
                            "text-sm font-medium",
                            popular ? "text-vmk-ink/70" : "text-white/70"
                          )}
                        >
                          {plan.name}
                        </span>
                        <span className="font-display text-2xl font-bold">
                          {formatInr(plan.amountInr)}
                        </span>
                      </div>
                      {plan.inclusions && (
                        <p
                          className={cn(
                            "mt-1 flex gap-2 text-xs leading-relaxed",
                            popular ? "text-muted-foreground" : "text-white/55"
                          )}
                        >
                          <Check
                            className={cn(
                              "mt-0.5 size-3.5 shrink-0",
                              popular ? "text-vmk-green" : "text-vmk-lime"
                            )}
                            aria-hidden
                          />
                          {plan.inclusions}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
                <a
                  href="#book-trial"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "mt-6 w-full justify-center",
                    popular
                      ? "bg-vmk-green text-white hover:bg-vmk-green/90"
                      : "bg-vmk-lime text-vmk-lime-foreground hover:bg-vmk-lime/90"
                  )}
                >
                  Book Free Trial
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
