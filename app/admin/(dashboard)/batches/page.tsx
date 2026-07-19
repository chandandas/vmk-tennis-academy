import { db } from "@/lib/db";
import {
  AdminTable,
  EmptyState,
  PageHeader,
  StatusBadge,
} from "@/components/admin/ui";
import { upsertBatch, toggleBatchActive } from "@/app/actions/admin-batches";
import { asFormAction } from "@/lib/validators";

export const dynamic = "force-dynamic";

function parseDays(raw: string) {
  try {
    const parsed = JSON.parse(raw) as string[];
    if (Array.isArray(parsed)) return parsed.join(", ");
  } catch {
    /* fall through */
  }
  return raw;
}

export default async function BatchesPage() {
  const [batches, programs, coaches] = await Promise.all([
    db.batch.findMany({
      orderBy: [{ isActive: "desc" }, { name: "asc" }],
      include: {
        program: true,
        coach: true,
        _count: { select: { students: true } },
      },
    }),
    db.program.findMany({ orderBy: { sortOrder: "asc" } }),
    db.coach.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div>
      <PageHeader
        title="Batches"
        description="Training groups, schedules, and capacity."
      />

      <details className="mb-8 rounded-lg border bg-card p-4" open>
        <summary className="cursor-pointer font-medium">
          Create / edit batch
        </summary>
        <form
          action={asFormAction(upsertBatch.bind(null, null))}
          className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          <div className="space-y-1 lg:col-span-3">
            <label className="text-xs text-muted-foreground">
              Existing batch (leave blank to create)
            </label>
            <select
              name="id"
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              defaultValue=""
            >
              <option value="">New batch</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  Edit: {b.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Name</label>
            <input
              name="name"
              required
              placeholder="Morning Juniors A"
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Program</label>
            <select
              name="programId"
              required
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="">Select…</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Coach</label>
            <select
              name="coachId"
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="">—</option>
              {coaches.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Time slot</label>
            <select
              name="timeSlot"
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              defaultValue="MORNING"
            >
              <option value="MORNING">Morning</option>
              <option value="EVENING">Evening</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Start time</label>
            <input
              name="startTime"
              required
              placeholder="06:00"
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">End time</label>
            <input
              name="endTime"
              required
              placeholder="07:30"
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">
              Days (comma-separated)
            </label>
            <input
              name="daysOfWeek"
              defaultValue="MON,WED,FRI"
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Court</label>
            <input
              name="court"
              placeholder="Court 1"
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Capacity</label>
            <input
              name="capacity"
              type="number"
              min={1}
              defaultValue={8}
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="rounded-md bg-vmk-green px-4 py-2 text-sm font-medium text-white"
            >
              Save batch
            </button>
          </div>
        </form>
        <p className="mt-2 text-xs text-muted-foreground">
          Tip: choose an existing batch above, then fill fields to update it
          (name/program/times required on every save).
        </p>
      </details>

      {batches.length === 0 ? (
        <EmptyState
          title="No batches yet"
          description="Create a batch to start scheduling."
        />
      ) : (
        <AdminTable
          headers={[
            "Name",
            "Program",
            "Schedule",
            "Coach",
            "Students",
            "Status",
            "",
          ]}
        >
          {batches.map((b) => (
            <tr key={b.id} className="hover:bg-muted/30">
              <td className="px-4 py-3 font-medium">{b.name}</td>
              <td className="px-4 py-3">{b.program.name}</td>
              <td className="px-4 py-3 text-muted-foreground">
                <div>
                  {b.timeSlot} · {b.startTime}–{b.endTime}
                </div>
                <div className="text-xs">{parseDays(b.daysOfWeek)}</div>
                {b.court && <div className="text-xs">{b.court}</div>}
              </td>
              <td className="px-4 py-3">{b.coach?.name ?? "—"}</td>
              <td className="px-4 py-3">
                {b._count.students}/{b.capacity}
              </td>
              <td className="px-4 py-3">
                <StatusBadge
                  label={b.isActive ? "Active" : "Inactive"}
                  tone={b.isActive ? "success" : "default"}
                />
              </td>
              <td className="px-4 py-3 text-right">
                <form
                  action={toggleBatchActive.bind(null, b.id, !b.isActive)}
                >
                  <button
                    type="submit"
                    className="text-sm font-medium text-vmk-green hover:underline"
                  >
                    {b.isActive ? "Deactivate" : "Activate"}
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </div>
  );
}
