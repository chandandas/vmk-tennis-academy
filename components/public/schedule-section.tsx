import type { ScheduleWindows } from "@/lib/site";

type Batch = {
  id: string;
  name: string;
  daysOfWeek: string;
  timeSlot: "MORNING" | "EVENING";
  startTime: string;
  endTime: string;
  court: string | null;
  program: { name: string; slug: string };
  coach: { name: string } | null;
};

type ScheduleSectionProps = {
  windows: ScheduleWindows;
  batches: Batch[];
};

function parseDays(raw: string): string {
  try {
    const days = JSON.parse(raw) as string[];
    return days.join(" · ");
  } catch {
    return raw;
  }
}

export function ScheduleSection({ windows, batches }: ScheduleSectionProps) {
  const morning = batches.filter((b) => b.timeSlot === "MORNING");
  const evening = batches.filter((b) => b.timeSlot === "EVENING");

  return (
    <section id="schedule" className="scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-vmk-green">
            Academy schedule
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-vmk-ink sm:text-4xl">
            Morning energy. Evening intensity.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Batches run within{" "}
            <strong>
              {windows.morning.start}–{windows.morning.end}
            </strong>{" "}
            and{" "}
            <strong>
              {windows.evening.start}–{windows.evening.end}
            </strong>
            .
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <ScheduleColumn
            title={windows.morning.label}
            range={`${windows.morning.start} – ${windows.morning.end}`}
            batches={morning}
          />
          <ScheduleColumn
            title={windows.evening.label}
            range={`${windows.evening.start} – ${windows.evening.end}`}
            batches={evening}
          />
        </div>
      </div>
    </section>
  );
}

function ScheduleColumn({
  title,
  range,
  batches,
}: {
  title: string;
  range: string;
  batches: Batch[];
}) {
  return (
    <div className="overflow-hidden border border-border bg-white">
      <div className="bg-vmk-green px-5 py-4 text-white">
        <h3 className="font-display text-xl font-bold">{title}</h3>
        <p className="text-sm text-vmk-lime">{range}</p>
      </div>
      <ul className="divide-y divide-border">
        {batches.length === 0 && (
          <li className="px-5 py-6 text-sm text-muted-foreground">
            No batches in this window yet.
          </li>
        )}
        {batches.map((batch) => (
          <li key={batch.id} className="px-5 py-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-medium text-vmk-ink">{batch.program.name}</p>
              <p className="font-mono text-sm text-vmk-green">
                {batch.startTime}–{batch.endTime}
              </p>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {parseDays(batch.daysOfWeek)}
              {batch.coach ? ` · ${batch.coach.name}` : ""}
              {batch.court ? ` · ${batch.court}` : ""}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
