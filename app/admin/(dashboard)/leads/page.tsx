import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/admin";
import {
  AdminTable,
  EmptyState,
  PageHeader,
  StatusBadge,
} from "@/components/admin/ui";
import { CreateLeadForm } from "@/components/admin/create-lead-form";

export const dynamic = "force-dynamic";

const STAGES = [
  "NEW",
  "CONTACTED",
  "TRIAL_SCHEDULED",
  "TRIAL_COMPLETED",
  "ENROLLED",
  "LOST",
] as const;

function stageTone(stage: string) {
  if (stage === "NEW") return "info" as const;
  if (stage === "ENROLLED") return "success" as const;
  if (stage === "LOST") return "danger" as const;
  if (stage === "TRIAL_SCHEDULED" || stage === "TRIAL_COMPLETED")
    return "warning" as const;
  return "default" as const;
}

type SearchParams = { stage?: string; q?: string };

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const stage = STAGES.includes(searchParams.stage as (typeof STAGES)[number])
    ? (searchParams.stage as (typeof STAGES)[number])
    : undefined;
  const q = searchParams.q?.trim();

  const [leads, programs, stageCounts] = await Promise.all([
    db.lead.findMany({
      where: {
        ...(stage ? { stage } : {}),
        ...(q
          ? {
              OR: [
                { playerName: { contains: q, mode: "insensitive" } },
                { phone: { contains: q } },
                { parentName: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      include: { program: true, assignedTo: true },
      take: 100,
    }),
    db.program.findMany({ orderBy: { sortOrder: "asc" } }),
    db.lead.groupBy({ by: ["stage"], _count: true }),
  ]);

  const countMap = Object.fromEntries(
    stageCounts.map((s) => [s.stage, s._count])
  );

  return (
    <div>
      <PageHeader
        title="Leads"
        description="Trial bookings and enquiries — move them through the pipeline."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <Link
          href="/admin/leads"
          className={`rounded-md px-3 py-1.5 text-xs font-medium ${
            !stage ? "bg-vmk-green text-white" : "bg-muted text-muted-foreground"
          }`}
        >
          All ({Object.values(countMap).reduce((a, b) => a + b, 0)})
        </Link>
        {STAGES.map((s) => (
          <Link
            key={s}
            href={`/admin/leads?stage=${s}`}
            className={`rounded-md px-3 py-1.5 text-xs font-medium ${
              stage === s
                ? "bg-vmk-green text-white"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {s.replaceAll("_", " ")} ({countMap[s] ?? 0})
          </Link>
        ))}
      </div>

      <form className="mb-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search name or phone…"
          className="w-full max-w-sm rounded-md border bg-background px-3 py-2 text-sm"
        />
        {stage && <input type="hidden" name="stage" value={stage} />}
      </form>

      <div className="mb-8">
        <CreateLeadForm programs={programs.map((p) => ({ id: p.id, name: p.name }))} />
      </div>

      {leads.length === 0 ? (
        <EmptyState title="No leads found" description="Try another filter or add a walk-in lead." />
      ) : (
        <AdminTable
          headers={["Player", "Contact", "Interest", "Source", "Stage", "Created", ""]}
        >
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-muted/30">
              <td className="px-4 py-3 font-medium">{lead.playerName}</td>
              <td className="px-4 py-3 text-muted-foreground">
                <div>{lead.phone}</div>
                <div className="text-xs">{lead.parentName ?? "—"}</div>
              </td>
              <td className="px-4 py-3">
                {lead.programInterest ?? lead.program?.name ?? "—"}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {lead.source.replaceAll("_", " ")}
              </td>
              <td className="px-4 py-3">
                <StatusBadge
                  label={lead.stage.replaceAll("_", " ")}
                  tone={stageTone(lead.stage)}
                />
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatDate(lead.createdAt)}
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/leads/${lead.id}`}
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
