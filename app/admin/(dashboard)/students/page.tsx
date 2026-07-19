import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/admin";
import {
  AdminTable,
  EmptyState,
  PageHeader,
  StatusBadge,
} from "@/components/admin/ui";
import { CreateStudentForm } from "@/components/admin/create-student-form";

export const dynamic = "force-dynamic";

const STATUSES = ["ACTIVE", "PAUSED", "LEFT"] as const;

function statusTone(status: string) {
  if (status === "ACTIVE") return "success" as const;
  if (status === "PAUSED") return "warning" as const;
  if (status === "LEFT") return "danger" as const;
  return "default" as const;
}

type SearchParams = { status?: string; q?: string };

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const status = STATUSES.includes(
    searchParams.status as (typeof STATUSES)[number]
  )
    ? (searchParams.status as (typeof STATUSES)[number])
    : undefined;
  const q = searchParams.q?.trim();

  const [students, programs, batches, statusCounts] = await Promise.all([
    db.student.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(q
          ? {
              OR: [
                { playerName: { contains: q, mode: "insensitive" } },
                { phone: { contains: q } },
                { email: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { playerName: "asc" },
      include: { program: true, batch: true },
      take: 150,
    }),
    db.program.findMany({ orderBy: { sortOrder: "asc" } }),
    db.batch.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
    db.student.groupBy({ by: ["status"], _count: true }),
  ]);

  const countMap = Object.fromEntries(
    statusCounts.map((s) => [s.status, s._count])
  );

  return (
    <div>
      <PageHeader
        title="Students"
        description="Enrolled players, assignments, and status."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <Link
          href="/admin/students"
          className={`rounded-md px-3 py-1.5 text-xs font-medium ${
            !status
              ? "bg-vmk-green text-white"
              : "bg-muted text-muted-foreground"
          }`}
        >
          All ({Object.values(countMap).reduce((a, b) => a + b, 0)})
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/students?status=${s}`}
            className={`rounded-md px-3 py-1.5 text-xs font-medium ${
              status === s
                ? "bg-vmk-green text-white"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {s} ({countMap[s] ?? 0})
          </Link>
        ))}
      </div>

      <form className="mb-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search name, phone, or email…"
          className="w-full max-w-sm rounded-md border bg-background px-3 py-2 text-sm"
        />
        {status && <input type="hidden" name="status" value={status} />}
      </form>

      <div className="mb-8">
        <CreateStudentForm
          programs={programs.map((p) => ({ id: p.id, name: p.name }))}
          batches={batches.map((b) => ({
            id: b.id,
            name: b.name,
            programId: b.programId,
          }))}
        />
      </div>

      {students.length === 0 ? (
        <EmptyState
          title="No students found"
          description="Try another filter or add a student."
        />
      ) : (
        <AdminTable
          headers={[
            "Player",
            "Contact",
            "Program",
            "Batch",
            "Status",
            "Joined",
            "",
          ]}
        >
          {students.map((s) => (
            <tr key={s.id} className="hover:bg-muted/30">
              <td className="px-4 py-3 font-medium">{s.playerName}</td>
              <td className="px-4 py-3 text-muted-foreground">
                <div>{s.phone ?? "—"}</div>
                <div className="text-xs">{s.email ?? ""}</div>
              </td>
              <td className="px-4 py-3">{s.program?.name ?? "—"}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {s.batch?.name ?? "—"}
              </td>
              <td className="px-4 py-3">
                <StatusBadge
                  label={s.status}
                  tone={statusTone(s.status)}
                />
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatDate(s.joinDate)}
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/students/${s.id}`}
                  className="text-sm font-medium text-vmk-green hover:underline"
                >
                  Open
                </Link>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </div>
  );
}
