import { db } from "@/lib/db";
import {
  AdminTable,
  EmptyState,
  PageHeader,
  StatusBadge,
} from "@/components/admin/ui";
import { toggleCoachPublished } from "@/app/actions/admin-payments";
import { CoachForm } from "@/components/admin/coach-form";

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
        description="Public coach profiles shown on the website."
      />

      <CoachForm
        coaches={coaches.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          photoUrl: c.photoUrl,
          certifications: c.certifications,
          playingBackground: c.playingBackground,
          specialization: c.specialization,
          bio: c.bio,
          isPublished: c.isPublished,
          sortOrder: c.sortOrder,
        }))}
      />

      {coaches.length === 0 ? (
        <EmptyState title="No coaches yet" description="Add a coach profile." />
      ) : (
        <AdminTable
          headers={["Name", "Role", "Batches", "Status", ""]}
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
