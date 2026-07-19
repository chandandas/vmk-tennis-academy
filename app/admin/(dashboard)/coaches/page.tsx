import { db } from "@/lib/db";
import {
  AdminTable,
  EmptyState,
  PageHeader,
  StatusBadge,
} from "@/components/admin/ui";
import {
  toggleCoachPublished,
  upsertCoach,
} from "@/app/actions/admin-payments";
import { asFormAction } from "@/lib/validators";

export const dynamic = "force-dynamic";

export default async function CoachesPage() {
  const coaches = await db.coach.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { batches: true } } },
  });

  return (
    <div>
      <PageHeader
        title="Coaches"
        description="Public coach profiles (ADMIN actions). UI visible to all staff."
      />

      <details className="mb-8 rounded-lg border bg-card p-4" open>
        <summary className="cursor-pointer font-medium">
          Create / edit coach
        </summary>
        <form
          action={asFormAction(upsertCoach.bind(null, null))}
          className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          <div className="space-y-1 lg:col-span-3">
            <label className="text-xs text-muted-foreground">
              Existing coach (blank = create)
            </label>
            <select
              name="id"
              defaultValue=""
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="">New coach</option>
              {coaches.map((c) => (
                <option key={c.id} value={c.id}>
                  Edit: {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Name</label>
            <input
              name="name"
              required
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Slug</label>
            <input
              name="slug"
              placeholder="auto from name"
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Photo URL</label>
            <input
              name="photoUrl"
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">
              Specialization
            </label>
            <input
              name="specialization"
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">
              Certifications
            </label>
            <input
              name="certifications"
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Sort order</label>
            <input
              name="sortOrder"
              type="number"
              defaultValue={0}
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs text-muted-foreground">
              Playing background
            </label>
            <input
              name="playingBackground"
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>
          <div className="space-y-1 sm:col-span-2 lg:col-span-3">
            <label className="text-xs text-muted-foreground">Bio</label>
            <textarea
              name="bio"
              rows={3}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isPublished" value="true" />
            Published on site
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              className="rounded-md bg-vmk-green px-4 py-2 text-sm font-medium text-white"
            >
              Save coach
            </button>
          </div>
        </form>
      </details>

      {coaches.length === 0 ? (
        <EmptyState title="No coaches yet" description="Add a coach profile." />
      ) : (
        <AdminTable
          headers={["Name", "Specialization", "Batches", "Status", ""]}
        >
          {coaches.map((c) => (
            <tr key={c.id} className="hover:bg-muted/30">
              <td className="px-4 py-3">
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-muted-foreground">/{c.slug}</div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {c.specialization ?? "—"}
              </td>
              <td className="px-4 py-3">{c._count.batches}</td>
              <td className="px-4 py-3">
                <StatusBadge
                  label={c.isPublished ? "Published" : "Draft"}
                  tone={c.isPublished ? "success" : "default"}
                />
              </td>
              <td className="px-4 py-3 text-right">
                <form
                  action={toggleCoachPublished.bind(
                    null,
                    c.id,
                    !c.isPublished
                  )}
                >
                  <button
                    type="submit"
                    className="text-sm font-medium text-vmk-green hover:underline"
                  >
                    {c.isPublished ? "Unpublish" : "Publish"}
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
