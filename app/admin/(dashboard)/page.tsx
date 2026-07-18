import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-vmk-green">
        Dashboard
      </h1>
      <p className="mt-2 text-muted-foreground">
        KPI cards and charts — milestone 4+.
      </p>
    </div>
  );
}
