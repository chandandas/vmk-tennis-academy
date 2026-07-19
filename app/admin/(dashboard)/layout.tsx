import Link from "next/link";
import { AdminNavLink } from "@/components/admin/ui";
import { AdminUserMenu } from "@/components/admin/user-menu";
import { requireAdminSession } from "@/lib/admin";

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

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminSession();

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="hidden w-56 shrink-0 bg-sidebar text-sidebar-foreground md:flex md:flex-col">
        <div className="border-b border-sidebar-border px-4 py-5">
          <Link
            href="/admin"
            className="font-display text-lg font-bold text-sidebar-primary"
          >
            VMKTA CRM
          </Link>
          <p className="mt-0.5 text-xs text-sidebar-foreground/60">
            Tennis Academy
          </p>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-3">
          {nav.map((item) => (
            <AdminNavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <Link
            href="/"
            className="block rounded-md px-3 py-2 text-xs text-sidebar-foreground/70 hover:bg-sidebar-accent"
          >
            ← Public site
          </Link>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between gap-3 border-b bg-card px-4">
          <span className="text-sm font-medium text-muted-foreground md:hidden">
            VMKTA Admin
          </span>
          <div className="ml-auto">
            <AdminUserMenu />
          </div>
        </header>
        <div className="flex gap-1 overflow-x-auto border-b bg-card px-3 py-2 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
