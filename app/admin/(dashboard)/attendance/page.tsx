import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/admin";
import {
  AdminTable,
  EmptyState,
  PageHeader,
  StatusBadge,
} from "@/components/admin/ui";
import { markAttendance } from "@/app/actions/admin-batches";
import { asFormAction } from "@/lib/validators";

export const dynamic = "force-dynamic";

type SearchParams = { batchId?: string; date?: string };

function todayIso() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const dateStr = searchParams.date || todayIso();
  const batchId = searchParams.batchId;

  const batches = await db.batch.findMany({
    where: { isActive: true },
    include: { program: true },
    orderBy: { name: "asc" },
  });

  const selectedBatch =
    batchId && batches.find((b) => b.id === batchId)
      ? batchId
      : batches[0]?.id;

  const date = new Date(`${dateStr}T00:00:00.000Z`);

  const students = selectedBatch
    ? await db.student.findMany({
        where: { batchId: selectedBatch, status: "ACTIVE" },
        orderBy: { playerName: "asc" },
      })
    : [];

  const existing =
    selectedBatch && students.length > 0
      ? await db.attendanceRecord.findMany({
          where: {
            batchId: selectedBatch,
            date,
            studentId: { in: students.map((s) => s.id) },
          },
        })
      : [];

  const presentMap = Object.fromEntries(
    existing.map((r) => [r.studentId, r.present])
  );

  return (
    <div>
      <PageHeader
        title="Attendance"
        description="Mark present/absent for a batch on a given day."
      />

      <form className="mb-6 flex flex-wrap items-end gap-3 rounded-lg border bg-card p-4">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Batch</label>
          <select
            name="batchId"
            defaultValue={selectedBatch ?? ""}
            className="flex h-9 min-w-[200px] rounded-md border bg-background px-3 text-sm"
          >
            {batches.length === 0 && <option value="">No active batches</option>}
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.program.name})
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Date</label>
          <input
            type="date"
            name="date"
            defaultValue={dateStr}
            className="flex h-9 rounded-md border bg-background px-3 text-sm"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-vmk-green px-4 py-2 text-sm font-medium text-white"
        >
          Load
        </button>
      </form>

      {!selectedBatch ? (
        <EmptyState
          title="No batches available"
          description="Create an active batch first."
        />
      ) : students.length === 0 ? (
        <EmptyState
          title="No active students in this batch"
          description="Assign students to the batch, then mark attendance."
        />
      ) : (
        <form action={asFormAction(markAttendance.bind(null, null))}>
          <input type="hidden" name="batchId" value={selectedBatch} />
          <input type="hidden" name="date" value={dateStr} />

          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {students.length} students · {formatDate(date)}
            </p>
            <button
              type="submit"
              className="rounded-md bg-vmk-green px-4 py-2 text-sm font-medium text-white"
            >
              Save attendance
            </button>
          </div>

          <AdminTable headers={["Present", "Player", "Phone", "Prior"]}>
            {students.map((s) => {
              const prior = presentMap[s.id];
              return (
                <tr key={s.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <input type="hidden" name="studentId" value={s.id} />
                    <input
                      type="checkbox"
                      name={`present_${s.id}`}
                      defaultChecked={prior !== false}
                      className="h-4 w-4 rounded border"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">
                    <Link
                      href={`/admin/students/${s.id}`}
                      className="text-vmk-green hover:underline"
                    >
                      {s.playerName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {s.phone ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    {prior === undefined ? (
                      <span className="text-xs text-muted-foreground">
                        Not marked
                      </span>
                    ) : (
                      <StatusBadge
                        label={prior ? "Was present" : "Was absent"}
                        tone={prior ? "success" : "danger"}
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </AdminTable>
        </form>
      )}
    </div>
  );
}
