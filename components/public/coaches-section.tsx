type Coach = {
  id: string;
  name: string;
  photoUrl: string | null;
  certifications: string | null;
  playingBackground: string | null;
  specialization: string | null;
};

type CoachesSectionProps = {
  coaches: Coach[];
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function CoachesSection({ coaches }: CoachesSectionProps) {
  return (
    <section id="coaches" className="scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-vmk-green">
            Meet our coaches
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-vmk-ink sm:text-4xl">
            Guided by certified professionals
          </h2>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {coaches.map((coach) => (
            <article
              key={coach.id}
              className="group overflow-hidden border border-border bg-white shadow-[0_16px_40px_-24px_rgba(11,61,46,0.45)] transition hover:-translate-y-0.5"
            >
              <div className="relative flex aspect-[5/4] items-end bg-gradient-to-br from-vmk-green via-[#135239] to-[#0a2a20] p-6">
                <div
                  aria-hidden
                  className="absolute right-4 top-4 flex size-20 items-center justify-center rounded-full border-2 border-vmk-lime/40 bg-vmk-lime/15 font-display text-2xl font-bold text-vmk-lime"
                >
                  {initials(coach.name)}
                </div>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 20% 80%, #c6f432 0%, transparent 40%)",
                  }}
                />
                <div className="relative">
                  <h3 className="font-display text-2xl font-bold text-white">
                    {coach.name}
                  </h3>
                  {coach.specialization && (
                    <p className="mt-1 text-sm text-vmk-lime">
                      {coach.specialization}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2 p-5 text-sm text-muted-foreground">
                {coach.certifications && (
                  <p>
                    <span className="font-medium text-vmk-ink">
                      Certifications:{" "}
                    </span>
                    {coach.certifications}
                  </p>
                )}
                {coach.playingBackground && <p>{coach.playingBackground}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
