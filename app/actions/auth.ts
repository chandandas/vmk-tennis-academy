"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";
import type { ActionResult } from "@/lib/validators";

export async function loginAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || password.length < 8) {
    return { ok: false, message: "Enter a valid email and password (8+ chars)." };
  }

  if (!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET) {
    return {
      ok: false,
      message:
        "Server misconfigured: AUTH_SECRET is missing. Add it in Vercel → Settings → Environment Variables, then redeploy.",
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin",
    });
    return { ok: true, message: "Signed in" };
  } catch (err) {
    if (err instanceof AuthError) {
      const type = String(err.type);
      // Missing/invalid AUTH_SECRET often surfaces as Configuration
      if (type === "Configuration" || type.includes("Configuration")) {
        return {
          ok: false,
          message:
            "Server misconfigured: set AUTH_SECRET on Vercel and redeploy.",
        };
      }
      if (type === "CredentialsSignin") {
        return { ok: false, message: "Invalid email or password." };
      }
      return {
        ok: false,
        message: `Sign-in failed (${type}). Check server auth configuration.`,
      };
    }
    throw err;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/admin/login" });
}
