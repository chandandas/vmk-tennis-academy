import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatDate, formatDateTime, formatInr } from "@/lib/admin";
import { PageHeader, StatusBadge } from "@/components/admin/ui";
import {
  addProgressNote,
  updateStudentAssignment,
  updateStudentStatus,
} from "@/app/actions/admin-students";
import { asFormAction } from "@/lib/validators";

export const dynamic = "force-dynamic";

type Props = { params: { id: string } };

function statusTone(status: string) {
  if (status === "ACTIVE") return "success" as const;
  if (status === "PAUSED") return "warning" as const;
  if (status === "LEFT") return "danger" as const;
  return "default" as const;
}

function paymentTone(status: string) {
  if (status === "PAID") return "success" as const;
  if (status === "OVERDUE") return "danger" as const;
  if (status === "PENDING") return "warning" as const;
  return "default" as const;
}

export default async function StudentDetailPage({ params }: Props) {
  const student = await db.student.findUnique({
    where: { id: params.id },
    include: {
      program: true,
      batch: true,
      guardians: true,
      payments: { orderBy: { createdAt: "desc" }, take: 20 },
      progressNotes: {
        orderBy: { createdAt: "desc" },
        include: { author: true },
        take: 30,
      },
      attendance: {
        orderBy: { date: "desc" },
        take: 60,
      },
      lead: true,
    },
  });

  if (!student) notFound();

  const [programs, batches] = await Promise.all([
    db.program.findMany({ orderBy: { sortOrder: "asc" } }),
    db.batch.findMany({
      where: { isActive: true },
      include: { program: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const presentCount = student.attendance.filter((a) => a.present).length;
  const attendancePct =
    student.attendance.length > 0
      ? Math.round((presentCount / student.attendance.length) * 100)
      : null;

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/admin/students"
          className="text-sm text-vmk-green hover:underline"
        >
          ← All students
        </Link>
      </div>
      <PageHeader
        title={student.playerName}
        description={`Joined ${formatDate(student.joinDate)}`}
        actions={
          <StatusBadge
            label={student.status}
            tone={statusTone(student.status)}
          />
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {(["ACTIVE", "PAUSED", "LEFT"] as const).map((s) => (
          <form key={s} action={asFormAction(updateStudentStatus.bind(null, student.id, s))}>
            <button
              type="submit"
              disabled={student.status === s}
              className="rounded-md border bg-card px-3 py-1.5 text-xs font-medium disabled:opacity-40 hover:border-vmk-green/40"
            >
              Set {s}
            </button>
          </form>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-lg border bg-card p-4">
            <h2 className="font-display text-lg font-semibold">Details</h2>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2 text-sm">
              <div>
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="font-medium">{student.phone ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium">{student.email ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Emergency</dt>
                <dd className="font-medium">
                  {student.emergencyContact ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Program / Batch</dt>
                <dd className="font-medium">
                  {student.program?.name ?? "—"} / {student.batch?.name ?? "—"}
                </dd>
              </div>
              {student.medicalNotes && (
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground">Medical notes</dt>
                  <dd className="mt-1">{student.medicalNotes}</dd>
                </div>
              )}
              {student.lead && (
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground">From lead</dt>
                  <dd>
                    <Link
                      href={`/admin/leads/${student.lead.id}`}
                      className="font-medium text-vmk-green hover:underline"
                    >
                      View lead →
                    </Link>
                  </dd>
                </div>
              )}
            </dl>
          </section>

          <section className="rounded-lg border bg-card p-4">
            <h2 className="font-display text-lg font-semibold">Guardians</h2>
            {student.guardians.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                No guardians on file
              </p>
            ) : (
              <ul className="mt-3 divide-y text-sm">
                {student.guardians.map((g) => (
                  <li key={g.id} className="py-2">
                    <p className="font-medium">
                      {g.name}
                      {g.relation ? (
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({g.relation})
                        </span>
                      ) : null}
                    </p>
                    <p className="text-muted-foreground">
                      {g.phone}
                      {g.email ? ` · ${g.email}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-lg border bg-card p-4">
            <h2 className="font-display text-lg font-semibold">Payments</h2>
            {student.payments.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                No payments yet
              </p>
            ) : (
              <ul className="mt-3 divide-y text-sm">
                {student.payments.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-2 py-2"
                  >
                    <div>
                      <p className="font-medium">{formatInr(p.amountInr)}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(p.paidAt ?? p.dueDate ?? p.createdAt)} ·{" "}
                        {p.method}
                        {p.receiptNo ? ` · ${p.receiptNo}` : ""}
                      </p>
                    </div>
                    <StatusBadge
                      label={p.status}
                      tone={paymentTone(p.status)}
                    />
                  </li>
                ))}
              </ul>
            )}
            <Link
              href="/admin/payments"
              className="mt-3 inline-block text-sm text-vmk-green hover:underline"
            >
              Record payment →
            </Link>
          </section>

          <section className="rounded-lg border bg-card p-4">
            <h2 className="font-display text-lg font-semibold">
              Progress notes
            </h2>
            <form
              action={asFormAction(addProgressNote.bind(null, null))}
              className="mt-3 flex gap-2"
            >
              <input type="hidden" name="studentId" value={student.id} />
              <input
                name="body"
                required
                placeholder="Add a progress note…"
                className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="rounded-md bg-vmk-green px-3 py-2 text-sm font-medium text-white"
              >
                Add
              </button>
            </form>
            <ul className="mt-4 space-y-3">
              {student.progressNotes.map((n) => (
                <li
                  key={n.id}
                  className="border-l-2 border-vmk-lime pl-3 text-sm"
                >
                  <p>{n.body}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {n.author?.name ?? "Staff"} · {formatDateTime(n.createdAt)}
                  </p>
                </li>
              ))}
              {student.progressNotes.length === 0 && (
                <li className="text-sm text-muted-foreground">No notes yet</li>
              )}
            </ul>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-lg border bg-card p-4">
            <h2 className="font-display text-lg font-semibold">Assignment</h2>
            <form
              action={asFormAction(updateStudentAssignment.bind(null, null))}
              className="mt-3 space-y-3"
            >
              <input type="hidden" name="studentId" value={student.id} />
              <div>
                <label className="text-xs text-muted-foreground">Program</label>
                <select
                  name="programId"
                  defaultValue={student.programId ?? ""}
                  className="mt-1 flex h-9 w-full rounded-md border bg-background px-3 text-sm"
                >
                  <option value="">—</option>
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Batch</label>
                <select
                  name="batchId"
                  defaultValue={student.batchId ?? ""}
                  className="mt-1 flex h-9 w-full rounded-md border bg-background px-3 text-sm"
                >
                  <option value="">—</option>
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.program.name})
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-vmk-green px-3 py-2 text-sm font-medium text-white"
              >
                Update assignment
              </button>
            </form>
          </section>

          <section className="rounded-lg border bg-card p-4">
            <h2 className="font-display text-lg font-semibold">Attendance</h2>
            <p className="mt-2 text-2xl font-bold text-vmk-green">
              {attendancePct != null ? `${attendancePct}%` : "—"}
            </p>
            <p className="text-xs text-muted-foreground">
              {presentCount} present of {student.attendance.length} recent
              sessions
            </p>
            <ul className="mt-4 max-h-64 space-y-1 overflow-y-auto text-sm">
              {student.attendance.slice(0, 15).map((a) => (
                <li
                  key={a.id}
                  className="flex justify-between gap-2 text-muted-foreground"
                >
                  <span>{formatDate(a.date)}</span>
                  <span className={a.present ? "text-emerald-700" : "text-red-700"}>
                    {a.present ? "Present" : "Absent"}
                  </span>
                </li>
              ))}
              {student.attendance.length === 0 && (
                <li className="text-muted-foreground">No records yet</li>
              )}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
