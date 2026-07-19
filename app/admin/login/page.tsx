import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/login-form";

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
          Sign in with your staff account.
        </p>
        <LoginForm />
        <p className="mt-4 text-center text-sm">
          <Link
            href="/"
            className="text-vmk-green underline-offset-4 hover:underline"
          >
            ← Back to site
          </Link>
        </p>
      </div>
    </main>
  );
}
