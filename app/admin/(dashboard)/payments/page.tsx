import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate, formatInr } from "@/lib/admin";
import {
  AdminTable,
  EmptyState,
  PageHeader,
  StatusBadge,
} from "@/components/admin/ui";
import {
  markPaymentPaid,
  recordPayment,
} from "@/app/actions/admin-payments";
import { asFormAction } from "@/lib/validators";

export const dynamic = "force-dynamic";

const STATUSES = ["PENDING", "PAID", "OVERDUE", "CANCELLED"] as const;

function paymentTone(status: string) {
  if (status === "PAID") return "success" as const;
  if (status === "OVERDUE") return "danger" as const;
  if (status === "PENDING") return "warning" as const;
  return "default" as const;
}

type SearchParams = { status?: string };

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const status = STATUSES.includes(
    searchParams.status as (typeof STATUSES)[number]
  )
    ? (searchParams.status as (typeof STATUSES)[number])
    : undefined;

  const [payments, students, feePlans, statusCounts] = await Promise.all([
    db.payment.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: "desc" },
      include: { student: true, feePlan: true },
      take: 100,
    }),
    db.student.findMany({
      where: { status: { in: ["ACTIVE", "PAUSED"] } },
      orderBy: { playerName: "asc" },
    }),
    db.feePlan.findMany({
      where: { isActive: true },
      include: { program: true },
      orderBy: { sortOrder: "asc" },
    }),
    db.payment.groupBy({ by: ["status"], _count: true }),
  ]);

  const countMap = Object.fromEntries(
    statusCounts.map((s) => [s.status, s._count])
  );

  return (
    <div>
      <PageHeader
        title="Payments"
        description="Record fees and track paid vs pending."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <Link
          href="/admin/payments"
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
            href={`/admin/payments?status=${s}`}
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

      <details className="mb-8 rounded-lg border bg-card p-4" open>
        <summary className="cursor-pointer font-medium">Record payment</summary>
        <form
          action={asFormAction(recordPayment.bind(null, null))}
          className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Student</label>
            <select
              name="studentId"
              required
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="">Select…</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.playerName}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Amount (₹)</label>
            <input
              name="amountInr"
              type="number"
              min={1}
              required
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Fee plan</label>
            <select
              name="feePlanId"
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="">—</option>
              {feePlans.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.program.name}) — {formatInr(f.amountInr)}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Method</label>
            <select
              name="method"
              defaultValue="CASH"
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="CASH">Cash</option>
              <option value="UPI">UPI</option>
              <option value="BANK">Bank</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Status</label>
            <select
              name="status"
              defaultValue="PAID"
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="OVERDUE">Overdue</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Due date</label>
            <input
              type="date"
              name="dueDate"
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs text-muted-foreground">Notes</label>
            <input
              name="notes"
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="rounded-md bg-vmk-green px-4 py-2 text-sm font-medium text-white"
            >
              Save payment
            </button>
          </div>
        </form>
      </details>

      {payments.length === 0 ? (
        <EmptyState
          title="No payments found"
          description="Record a payment or change the filter."
        />
      ) : (
        <AdminTable
          headers={[
            "Student",
            "Amount",
            "Method",
            "Status",
            "Date",
            "Receipt",
            "",
          ]}
        >
          {payments.map((p) => (
            <tr key={p.id} className="hover:bg-muted/30">
              <td className="px-4 py-3 font-medium">
                <Link
                  href={`/admin/students/${p.studentId}`}
                  className="text-vmk-green hover:underline"
                >
                  {p.student.playerName}
                </Link>
                {p.feePlan && (
                  <div className="text-xs text-muted-foreground">
                    {p.feePlan.name}
                  </div>
                )}
              </td>
              <td className="px-4 py-3">{formatInr(p.amountInr)}</td>
              <td className="px-4 py-3 text-muted-foreground">{p.method}</td>
              <td className="px-4 py-3">
                <StatusBadge
                  label={p.status}
                  tone={paymentTone(p.status)}
                />
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatDate(p.paidAt ?? p.dueDate ?? p.createdAt)}
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {p.receiptNo ?? "—"}
              </td>
              <td className="px-4 py-3 text-right">
                {(p.status === "PENDING" || p.status === "OVERDUE") && (
                  <form action={asFormAction(markPaymentPaid.bind(null, p.id))}>
                    <button
                      type="submit"
                      className="text-sm font-medium text-vmk-green hover:underline"
                    >
                      Mark paid
                    </button>
                  </form>
                )}
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </div>
  );
}
