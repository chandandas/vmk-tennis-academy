import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatDate, formatDateTime } from "@/lib/admin";
import { PageHeader, StatusBadge } from "@/components/admin/ui";
import { LeadActions } from "@/components/admin/lead-actions";
import {
  addFollowUp,
  addLeadNote,
  completeFollowUp,
  convertLeadToStudent,
  scheduleTrial,
  updateLeadStage,
} from "@/app/actions/admin-leads";
import { asStatefulFormAction } from "@/lib/validators";

export const dynamic = "force-dynamic";

type Props = { params: { id: string } };

export default async function LeadDetailPage({ params }: Props) {
  const lead = await db.lead.findUnique({
    where: { id: params.id },
    include: {
      program: true,
      assignedTo: true,
      notes: { orderBy: { createdAt: "desc" }, include: { author: true } },
      followUps: { orderBy: { dueAt: "asc" }, include: { assignedTo: true } },
      trialAppointments: {
        orderBy: { scheduledAt: "desc" },
        include: { coach: true, batch: true },
      },
      student: true,
    },
  });

  if (!lead) notFound();

  const [coaches, batches, programs] = await Promise.all([
    db.coach.findMany({ orderBy: { sortOrder: "asc" } }),
    db.batch.findMany({
      where: { isActive: true },
      include: { program: true },
      orderBy: { name: "asc" },
    }),
    db.program.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/admin/leads"
          className="text-sm text-vmk-green hover:underline"
        >
          ← All leads
        </Link>
      </div>
      <PageHeader
        title={lead.playerName}
        description={`${lead.source.replaceAll("_", " ")} · ${formatDate(lead.createdAt)}`}
        actions={
          <StatusBadge
            label={lead.stage.replaceAll("_", " ")}
            tone={
              lead.stage === "ENROLLED"
                ? "success"
                : lead.stage === "LOST"
                  ? "danger"
                  : "info"
            }
          />
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-lg border bg-card p-4">
            <h2 className="font-display text-lg font-semibold">Details</h2>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2 text-sm">
              <div>
                <dt className="text-muted-foreground">Parent</dt>
                <dd className="font-medium">{lead.parentName ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="font-medium">{lead.phone}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium">{lead.email ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Age</dt>
                <dd className="font-medium">{lead.playerAge ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Interest</dt>
                <dd className="font-medium">
                  {lead.programInterest ?? lead.program?.name ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Preferred slot</dt>
                <dd className="font-medium">{lead.preferredSlot ?? "—"}</dd>
              </div>
              {lead.message && (
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground">Message</dt>
                  <dd className="mt-1">{lead.message}</dd>
                </div>
              )}
              {lead.lostReason && (
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground">Lost reason</dt>
                  <dd className="mt-1">{lead.lostReason}</dd>
                </div>
              )}
              {lead.student && (
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground">Student record</dt>
                  <dd>
                    <Link
                      href={`/admin/students/${lead.student.id}`}
                      className="font-medium text-vmk-green hover:underline"
                    >
                      {lead.student.playerName} →
                    </Link>
                  </dd>
                </div>
              )}
            </dl>
          </section>

          <section className="rounded-lg border bg-card p-4">
            <h2 className="font-display text-lg font-semibold">Notes</h2>
            <form action={asStatefulFormAction(addLeadNote)} className="mt-3 flex gap-2">
              <input type="hidden" name="leadId" value={lead.id} />
              <input
                name="body"
                required
                placeholder="Add a note…"
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
              {lead.notes.map((n) => (
                <li key={n.id} className="border-l-2 border-vmk-lime pl-3 text-sm">
                  <p>{n.body}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {n.author?.name ?? "Staff"} · {formatDateTime(n.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-lg border bg-card p-4">
            <h2 className="font-display text-lg font-semibold">Follow-ups</h2>
            <form
              action={asStatefulFormAction(addFollowUp)}
              className="mt-3 grid gap-2 sm:grid-cols-3"
            >
              <input type="hidden" name="leadId" value={lead.id} />
              <input
                type="datetime-local"
                name="dueAt"
                required
                className="rounded-md border bg-background px-3 py-2 text-sm"
              />
              <input
                name="note"
                placeholder="Note"
                className="rounded-md border bg-background px-3 py-2 text-sm sm:col-span-1"
              />
              <button
                type="submit"
                className="rounded-md bg-vmk-green px-3 py-2 text-sm font-medium text-white"
              >
                Schedule
              </button>
            </form>
            <ul className="mt-4 space-y-2">
              {lead.followUps.map((f) => (
                <li
                  key={f.id}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <div>
                    <p className={f.completedAt ? "line-through opacity-60" : ""}>
                      {formatDateTime(f.dueAt)} — {f.note ?? "Follow up"}
                    </p>
                  </div>
                  {!f.completedAt && (
                    <form action={completeFollowUp.bind(null, f.id, lead.id)}>
                      <button type="submit" className="text-xs text-vmk-green">
                        Done
                      </button>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="space-y-6">
          <LeadActions
            leadId={lead.id}
            stage={lead.stage}
            hasStudent={!!lead.student}
            coaches={coaches.map((c) => ({ id: c.id, name: c.name }))}
            batches={batches.map((b) => ({
              id: b.id,
              name: `${b.name} (${b.program.name})`,
            }))}
            programs={programs.map((p) => ({ id: p.id, name: p.name }))}
            defaultProgramId={lead.programId}
            updateLeadStage={updateLeadStage}
            scheduleTrial={scheduleTrial}
            convertLeadToStudent={convertLeadToStudent}
          />

          <section className="rounded-lg border bg-card p-4">
            <h2 className="font-display text-lg font-semibold">Trials</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {lead.trialAppointments.map((t) => (
                <li key={t.id}>
                  {formatDateTime(t.scheduledAt)} · {t.coach?.name ?? "—"}
                  {t.completed ? " (done)" : ""}
                </li>
              ))}
              {lead.trialAppointments.length === 0 && (
                <li className="text-muted-foreground">No trials scheduled</li>
              )}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
