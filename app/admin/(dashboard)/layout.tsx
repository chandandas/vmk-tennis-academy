import Link from "next/link";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/students", label: "Students" },
  { href: "/admin/batches", label: "Batches" },
  { href: "/admin/attendance", label: "Attendance" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/coaches", label: "Coaches" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/settings", label: "Settings" },
];

/**
 * Admin shell — sidebar + topbar. Auth protection in milestone 4.
 */
export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="hidden w-56 shrink-0 bg-sidebar text-sidebar-foreground md:flex md:flex-col">
        <div className="border-b border-sidebar-border px-4 py-5">
          <Link href="/admin" className="font-display text-lg font-bold text-sidebar-primary">
            VMKTA CRM
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b bg-card px-4">
          <span className="text-sm font-medium text-muted-foreground md:hidden">
            VMKTA Admin
          </span>
          <span className="ml-auto text-sm text-muted-foreground">
            User menu (milestone 4)
          </span>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
