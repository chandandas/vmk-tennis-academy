import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-vmk-green px-4">
      <div className="w-full max-w-sm rounded-xl bg-vmk-cream p-8 shadow-lg">
        <h1 className="font-display text-2xl font-bold text-vmk-green">
          VMKTA Admin
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Credentials auth wires up in milestone 4.
        </p>
        <form className="mt-6 space-y-4" action="#" method="post">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="admin@vmkta.com"
              autoComplete="username"
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              disabled
            />
          </div>
          <Button type="button" className="w-full" disabled>
            Sign in (coming soon)
          </Button>
        </form>
        <p className="mt-4 text-center text-sm">
          <Link href="/" className="text-vmk-green underline-offset-4 hover:underline">
            ← Back to site
          </Link>
        </p>
      </div>
    </main>
  );
}
