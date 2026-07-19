import { db } from "@/lib/db";
import {
  AdminTable,
  EmptyState,
  PageHeader,
  StatusBadge,
} from "@/components/admin/ui";
import {
  createStaffUser,
  saveSiteSetting,
  toggleUserActive,
} from "@/app/actions/admin-content";
import { asFormAction } from "@/lib/validators";

export const dynamic = "force-dynamic";

const SETTING_KEYS = [
  { key: "academyName", label: "Academy name" },
  { key: "phone", label: "Phone" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "email", label: "Email" },
  { key: "address", label: "Address" },
] as const;

export default async function SettingsPage() {
  const [settings, users] = await Promise.all([
    db.siteSetting.findMany({
      where: { key: { in: SETTING_KEYS.map((s) => s.key) } },
    }),
    db.user.findMany({
      orderBy: [{ role: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true,
      },
    }),
  ]);

  const valueMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Site contact details and staff accounts (ADMIN actions)."
      />

      <section className="mb-10 space-y-4">
        <h2 className="font-display text-lg font-semibold">Site settings</h2>
        <p className="text-sm text-muted-foreground">
          Values are stored as JSON strings (e.g.{" "}
          <code className="rounded bg-muted px-1">&quot;VMK Tennis Academy&quot;</code>
          ).
        </p>
        <div className="grid gap-4">
          {SETTING_KEYS.map(({ key, label }) => (
            <form
              key={key}
              action={asFormAction(saveSiteSetting.bind(null, null))}
              className="rounded-lg border bg-card p-4"
            >
              <input type="hidden" name="key" value={key} />
              <label className="text-sm font-medium">{label}</label>
              <p className="mb-2 text-xs text-muted-foreground">key: {key}</p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  name="value"
                  defaultValue={
                    valueMap[key] ?? JSON.stringify(
                      key === "academyName"
                        ? "VMK Tennis Academy"
                        : key === "email"
                          ? "hello@vmkta.com"
                          : ""
                    )
                  }
                  className="flex h-9 flex-1 rounded-md border bg-background px-3 font-mono text-sm"
                />
                <button
                  type="submit"
                  className="rounded-md bg-vmk-green px-4 py-2 text-sm font-medium text-white"
                >
                  Save
                </button>
              </div>
            </form>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold">Staff users</h2>

        <details className="rounded-lg border bg-card p-4">
          <summary className="cursor-pointer font-medium">
            Create staff user
          </summary>
          <form
            action={asFormAction(createStaffUser.bind(null, null))}
            className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Name</label>
              <input
                name="name"
                required
                className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Email</label>
              <input
                name="email"
                type="email"
                required
                className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">
                Password (8+)
              </label>
              <input
                name="password"
                type="password"
                minLength={8}
                required
                className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Phone</label>
              <input
                name="phone"
                className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Role</label>
              <select
                name="role"
                defaultValue="FRONT_DESK"
                className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              >
                <option value="ADMIN">Admin</option>
                <option value="COACH">Coach</option>
                <option value="FRONT_DESK">Front desk</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="rounded-md bg-vmk-green px-4 py-2 text-sm font-medium text-white"
              >
                Create user
              </button>
            </div>
          </form>
        </details>

        {users.length === 0 ? (
          <EmptyState title="No users" />
        ) : (
          <AdminTable headers={["Name", "Email", "Role", "Status", ""]}>
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">
                  {u.name}
                  {u.phone && (
                    <div className="text-xs text-muted-foreground">
                      {u.phone}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3">
                  <StatusBadge label={u.role.replaceAll("_", " ")} tone="info" />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge
                    label={u.isActive ? "Active" : "Inactive"}
                    tone={u.isActive ? "success" : "danger"}
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <form
                    action={toggleUserActive.bind(null, u.id, !u.isActive)}
                  >
                    <button
                      type="submit"
                      className="text-sm font-medium text-vmk-green hover:underline"
                    >
                      {u.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </section>
    </div>
  );
}
