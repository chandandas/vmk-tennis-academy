import { db } from "@/lib/db";
import { formatInr } from "@/lib/admin";
import { PageHeader } from "@/components/admin/ui";
import { ReportsCharts } from "@/components/admin/reports-charts";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const [
    leadsBySource,
    leadsByStage,
    attendanceAgg,
    paidSum,
    pendingSum,
    enrolments,
  ] = await Promise.all([
    db.lead.groupBy({ by: ["source"], _count: true }),
    db.lead.groupBy({ by: ["stage"], _count: true }),
    db.attendanceRecord.groupBy({
      by: ["present"],
      _count: true,
    }),
    db.payment.aggregate({
      where: { status: "PAID" },
      _sum: { amountInr: true },
      _count: true,
    }),
    db.payment.aggregate({
      where: { status: { in: ["PENDING", "OVERDUE"] } },
      _sum: { amountInr: true },
      _count: true,
    }),
    db.enrollment.count({ where: { isActive: true } }),
  ]);

  const present =
    attendanceAgg.find((a) => a.present === true)?._count ?? 0;
  const absent =
    attendanceAgg.find((a) => a.present === false)?._count ?? 0;
  const attendanceTotal = present + absent;
  const attendancePct =
    attendanceTotal > 0 ? Math.round((present / attendanceTotal) * 100) : 0;

  const sourceData = leadsBySource
    .map((r) => ({
      name: r.source.replaceAll("_", " "),
      count: r._count,
    }))
    .sort((a, b) => b.count - a.count);

  const stageData = leadsByStage
    .map((r) => ({
      name: r.stage.replaceAll("_", " "),
      count: r._count,
    }))
    .sort((a, b) => b.count - a.count);

  const revenuePaid = paidSum._sum.amountInr ?? 0;
  const revenuePending = pendingSum._sum.amountInr ?? 0;

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Pipeline, attendance, and revenue snapshot."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Attendance rate"
          value={`${attendancePct}%`}
          hint={`${present} present / ${attendanceTotal} marked`}
        />
        <StatCard
          label="Revenue paid"
          value={formatInr(revenuePaid)}
          hint={`${paidSum._count} receipts`}
        />
        <StatCard
          label="Pending / overdue"
          value={formatInr(revenuePending)}
          hint={`${pendingSum._count} open`}
        />
        <StatCard
          label="Active enrolments"
          value={String(enrolments)}
          hint="Current program enrolments"
        />
      </div>

      <ReportsCharts sourceData={sourceData} stageData={stageData} />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <SimpleBarTable title="Leads by source" rows={sourceData} />
        <SimpleBarTable title="Leads by stage" rows={stageData} />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-display text-2xl font-bold text-vmk-green">
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function SimpleBarTable({
  title,
  rows,
}: {
  title: string;
  rows: { name: string; count: number }[];
}) {
  const max = Math.max(...rows.map((r) => r.count), 1);
  return (
    <section className="rounded-lg border bg-card p-4">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No data</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {rows.map((r) => (
            <li key={r.name}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{r.name}</span>
                <span className="font-medium">{r.count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-vmk-green"
                  style={{ width: `${(r.count / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
