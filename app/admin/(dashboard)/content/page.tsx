import Link from "next/link";
import { db } from "@/lib/db";
import {
  AdminTable,
  EmptyState,
  PageHeader,
  StatusBadge,
} from "@/components/admin/ui";
import {
  deleteFaq,
  toggleTestimonialPublished,
  upsertFaq,
  upsertGalleryItem,
  upsertTestimonial,
} from "@/app/actions/admin-content";
import { asFormAction } from "@/lib/validators";

export const dynamic = "force-dynamic";

type SearchParams = { tab?: string };

const TABS = [
  { id: "faqs", label: "FAQs" },
  { id: "testimonials", label: "Testimonials" },
  { id: "gallery", label: "Gallery" },
] as const;

export default async function ContentPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const tab =
    TABS.find((t) => t.id === searchParams.tab)?.id ?? "faqs";

  const [faqs, testimonials, gallery] = await Promise.all([
    db.faq.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
    db.testimonial.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    db.galleryItem.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="Content"
        description="FAQs, testimonials, and gallery (ADMIN save actions)."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Link
            key={t.id}
            href={`/admin/content?tab=${t.id}`}
            className={`rounded-md px-3 py-1.5 text-xs font-medium ${
              tab === t.id
                ? "bg-vmk-green text-white"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {tab === "faqs" && (
        <div className="space-y-8">
          <details className="rounded-lg border bg-card p-4" open>
            <summary className="cursor-pointer font-medium">
              Add / edit FAQ
            </summary>
            <form
              action={asFormAction(upsertFaq.bind(null, null))}
              className="mt-4 grid gap-3"
            >
              <select
                name="id"
                defaultValue=""
                className="flex h-9 w-full max-w-md rounded-md border bg-background px-3 text-sm"
              >
                <option value="">New FAQ</option>
                {faqs.map((f) => (
                  <option key={f.id} value={f.id}>
                    Edit: {f.question.slice(0, 60)}
                  </option>
                ))}
              </select>
              <input
                name="question"
                required
                placeholder="Question"
                className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              />
              <textarea
                name="answer"
                required
                rows={4}
                placeholder="Answer"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
              <div className="flex flex-wrap items-center gap-4">
                <input
                  name="sortOrder"
                  type="number"
                  defaultValue={0}
                  className="h-9 w-24 rounded-md border bg-background px-3 text-sm"
                />
                <input type="hidden" name="isPublished" value="true" />
                <button
                  type="submit"
                  className="rounded-md bg-vmk-green px-4 py-2 text-sm font-medium text-white"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </details>

          {faqs.length === 0 ? (
            <EmptyState title="No FAQs" />
          ) : (
            <AdminTable headers={["Question", "Order", "Status", ""]}>
              {faqs.map((f) => (
                <tr key={f.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <p className="font-medium">{f.question}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {f.answer}
                    </p>
                  </td>
                  <td className="px-4 py-3">{f.sortOrder}</td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      label={f.isPublished ? "Published" : "Draft"}
                      tone={f.isPublished ? "success" : "default"}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={deleteFaq.bind(null, f.id)}>
                      <button
                        type="submit"
                        className="text-sm text-red-700 hover:underline"
                      >
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </AdminTable>
          )}
        </div>
      )}

      {tab === "testimonials" && (
        <div className="space-y-8">
          <details className="rounded-lg border bg-card p-4" open>
            <summary className="cursor-pointer font-medium">
              Add / edit testimonial
            </summary>
            <form
              action={asFormAction(upsertTestimonial.bind(null, null))}
              className="mt-4 grid gap-3 sm:grid-cols-2"
            >
              <select
                name="id"
                defaultValue=""
                className="flex h-9 w-full rounded-md border bg-background px-3 text-sm sm:col-span-2"
              >
                <option value="">New testimonial</option>
                {testimonials.map((t) => (
                  <option key={t.id} value={t.id}>
                    Edit: {t.studentName}
                  </option>
                ))}
              </select>
              <input
                name="studentName"
                required
                placeholder="Student name"
                className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              />
              <input
                name="parentName"
                placeholder="Parent name"
                className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              />
              <input
                name="achievement"
                placeholder="Achievement"
                className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              />
              <input
                name="photoUrl"
                placeholder="Photo URL"
                className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              />
              <textarea
                name="quote"
                required
                rows={3}
                placeholder="Quote"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm sm:col-span-2"
              />
              <input
                name="sortOrder"
                type="number"
                defaultValue={0}
                className="h-9 w-24 rounded-md border bg-background px-3 text-sm"
              />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="isPublished" value="true" />
                Published
              </label>
              <button
                type="submit"
                className="rounded-md bg-vmk-green px-4 py-2 text-sm font-medium text-white sm:col-span-2 sm:w-fit"
              >
                Save testimonial
              </button>
            </form>
          </details>

          {testimonials.length === 0 ? (
            <EmptyState title="No testimonials" />
          ) : (
            <AdminTable headers={["Student", "Quote", "Status", ""]}>
              {testimonials.map((t) => (
                <tr key={t.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">
                    {t.studentName}
                    {t.achievement && (
                      <div className="text-xs text-muted-foreground">
                        {t.achievement}
                      </div>
                    )}
                  </td>
                  <td className="max-w-md px-4 py-3 text-muted-foreground">
                    <p className="line-clamp-2">{t.quote}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      label={t.isPublished ? "Published" : "Draft"}
                      tone={t.isPublished ? "success" : "default"}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form
                      action={toggleTestimonialPublished.bind(
                        null,
                        t.id,
                        !t.isPublished
                      )}
                    >
                      <button
                        type="submit"
                        className="text-sm font-medium text-vmk-green hover:underline"
                      >
                        {t.isPublished ? "Unpublish" : "Publish"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </AdminTable>
          )}
        </div>
      )}

      {tab === "gallery" && (
        <div className="space-y-8">
          <details className="rounded-lg border bg-card p-4" open>
            <summary className="cursor-pointer font-medium">
              Add / edit gallery item
            </summary>
            <form
              action={asFormAction(upsertGalleryItem.bind(null, null))}
              className="mt-4 grid gap-3 sm:grid-cols-2"
            >
              <select
                name="id"
                defaultValue=""
                className="flex h-9 w-full rounded-md border bg-background px-3 text-sm sm:col-span-2"
              >
                <option value="">New item</option>
                {gallery.map((g) => (
                  <option key={g.id} value={g.id}>
                    Edit: {g.title ?? g.imageUrl.slice(0, 40)}
                  </option>
                ))}
              </select>
              <input
                name="imageUrl"
                required
                placeholder="Image URL"
                className="flex h-9 w-full rounded-md border bg-background px-3 text-sm sm:col-span-2"
              />
              <input
                name="title"
                placeholder="Title"
                className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              />
              <input
                name="altText"
                placeholder="Alt text"
                className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              />
              <select
                name="category"
                defaultValue="TRAINING"
                className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              >
                <option value="TRAINING">Training</option>
                <option value="TOURNAMENTS">Tournaments</option>
                <option value="EVENTS">Events</option>
                <option value="FACILITIES">Facilities</option>
              </select>
              <input
                name="sortOrder"
                type="number"
                defaultValue={0}
                className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="isPublished" value="true" />
                Published
              </label>
              <button
                type="submit"
                className="rounded-md bg-vmk-green px-4 py-2 text-sm font-medium text-white sm:col-span-2 sm:w-fit"
              >
                Save gallery item
              </button>
            </form>
          </details>

          {gallery.length === 0 ? (
            <EmptyState title="No gallery items" />
          ) : (
            <AdminTable
              headers={["Preview", "Title", "Category", "Status"]}
            >
              {gallery.map((g) => (
                <tr key={g.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={g.imageUrl}
                      alt={g.altText ?? g.title ?? ""}
                      className="h-12 w-16 rounded object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {g.title ?? "—"}
                    <div className="max-w-xs truncate text-xs text-muted-foreground">
                      {g.imageUrl}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {g.category}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      label={g.isPublished ? "Published" : "Draft"}
                      tone={g.isPublished ? "success" : "default"}
                    />
                  </td>
                </tr>
              ))}
            </AdminTable>
          )}
        </div>
      )}
    </div>
  );
}
