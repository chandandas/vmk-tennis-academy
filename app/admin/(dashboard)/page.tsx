import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate, formatInr } from "@/lib/admin";
import { PageHeader, StatusBadge } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const [
    newLeads,
    activeStudents,
    trialsToday,
    overduePayments,
    paidThisMonth,
    recentLeads,
    upcomingTrials,
  ] = await Promise.all([
    db.lead.count({ where: { stage: "NEW" } }),
    db.student.count({ where: { status: "ACTIVE" } }),
    db.trialAppointment.count({
      where: {
        scheduledAt: { gte: startOfDay, lt: endOfDay },
        completed: false,
      },
    }),
    db.payment.count({
      where: {
        OR: [
          { status: "OVERDUE" },
          { status: "PENDING", dueDate: { lt: now } },
        ],
      },
    }),
    db.payment.aggregate({
      where: { status: "PAID", paidAt: { gte: startOfMonth } },
      _sum: { amountInr: true },
    }),
    db.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { program: true },
    }),
    db.trialAppointment.findMany({
      where: { scheduledAt: { gte: startOfDay }, completed: false },
      orderBy: { scheduledAt: "asc" },
      take: 6,
      include: { lead: true, coach: true },
    }),
  ]);

  const kpis = [
    { label: "New leads", value: String(newLeads), href: "/admin/leads?stage=NEW" },
    {
      label: "Active students",
      value: String(activeStudents),
      href: "/admin/students",
    },
    {
      label: "Trials today",
      value: String(trialsToday),
      href: "/admin/leads",
    },
    {
      label: "Overdue payments",
      value: String(overduePayments),
      href: "/admin/payments?status=OVERDUE",
    },
    {
      label: "Collected this month",
      value: formatInr(paidThisMonth._sum.amountInr ?? 0),
      href: "/admin/payments",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Academy snapshot — leads, trials, students, and fees."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((k) => (
          <Link
            key={k.label}
            href={k.href}
            className="rounded-lg border bg-card p-4 transition hover:border-vmk-green/40"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {k.label}
            </p>
            <p className="mt-2 font-display text-2xl font-bold text-vmk-green">
              {k.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border bg-card">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="font-display text-lg font-semibold">Recent leads</h2>
            <Link href="/admin/leads" className="text-sm text-vmk-green hover:underline">
              View all
            </Link>
          </div>
          <ul className="divide-y">
            {recentLeads.map((lead) => (
              <li key={lead.id}>
                <Link
                  href={`/admin/leads/${lead.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-muted/40"
                >
                  <div>
                    <p className="font-medium">{lead.playerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {lead.programInterest ?? lead.program?.name ?? "—"} ·{" "}
                      {formatDate(lead.createdAt)}
                    </p>
                  </div>
                  <StatusBadge
                    label={lead.stage.replaceAll("_", " ")}
                    tone={
                      lead.stage === "NEW"
                        ? "info"
                        : lead.stage === "ENROLLED"
                          ? "success"
                          : lead.stage === "LOST"
                            ? "danger"
                            : "default"
                    }
                  />
                </Link>
              </li>
            ))}
            {recentLeads.length === 0 && (
              <li className="px-4 py-8 text-center text-sm text-muted-foreground">
                No leads yet
              </li>
            )}
          </ul>
        </section>

        <section className="rounded-lg border bg-card">
          <div className="border-b px-4 py-3">
            <h2 className="font-display text-lg font-semibold">
              Upcoming trials
            </h2>
          </div>
          <ul className="divide-y">
            {upcomingTrials.map((t) => (
              <li key={t.id} className="px-4 py-3">
                <p className="font-medium">{t.lead.playerName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(t.scheduledAt)} · {t.coach?.name ?? "Unassigned"}
                </p>
              </li>
            ))}
            {upcomingTrials.length === 0 && (
              <li className="px-4 py-8 text-center text-sm text-muted-foreground">
                No upcoming trials
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
