"use client";

import { useFormState, useFormStatus } from "react-dom";
import { CheckCircle2 } from "lucide-react";
import { submitEnquiry } from "@/app/actions/leads";
import type { ActionResult } from "@/lib/validators";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ProgramOption = { name: string; slug: string };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        buttonVariants({ size: "lg" }),
        "w-full justify-center bg-vmk-green text-white hover:bg-vmk-green/90 disabled:opacity-70"
      )}
    >
      {pending ? "Sending…" : label}
    </button>
  );
}

function FieldError({
  errors,
  name,
}: {
  errors?: Record<string, string[]>;
  name: string;
}) {
  const msg = errors?.[name]?.[0];
  if (!msg) return null;
  return <p className="text-xs text-destructive">{msg}</p>;
}

export function EnquiryForm({
  programOptions,
}: {
  programOptions: ProgramOption[];
}) {
  const [state, formAction] = useFormState<ActionResult | null, FormData>(
    submitEnquiry,
    null
  );

  if (state?.ok) {
    return (
      <div
        id="enquire"
        className="scroll-mt-24 border border-vmk-lime bg-white p-6 sm:p-8"
        role="status"
      >
        <CheckCircle2 className="size-10 text-vmk-green" aria-hidden />
        <h3 className="mt-3 font-display text-xl font-bold text-vmk-green">
          Enquiry sent
        </h3>
        <p className="mt-2 text-muted-foreground">{state.message}</p>
      </div>
    );
  }

  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;

  return (
    <div
      id="enquire"
      className="scroll-mt-24 border border-border bg-white p-6 sm:p-8"
    >
      <h3 className="font-display text-xl font-bold text-vmk-green">
        Enquire now
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Questions about programs, fees, or batches? Send us a note.
      </p>

      {state && !state.ok && (
        <p
          className="mt-3 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {state.message}
        </p>
      )}

      <form action={formAction} className="relative mt-6 space-y-4" noValidate>
        <div className="pointer-events-none absolute -left-[9999px] opacity-0" aria-hidden>
          <label htmlFor="enquiry-website">Website</label>
          <input
            id="enquiry-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="enquiry-name">Name</Label>
          <Input id="enquiry-name" name="name" required autoComplete="name" />
          <FieldError errors={fieldErrors} name="name" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="enquiry-phone">Phone</Label>
            <Input
              id="enquiry-phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              placeholder="10-digit mobile"
              required
              autoComplete="tel"
            />
            <FieldError errors={fieldErrors} name="phone" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="enquiry-email">Email (optional)</Label>
            <Input
              id="enquiry-email"
              name="email"
              type="email"
              autoComplete="email"
            />
            <FieldError errors={fieldErrors} name="email" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="enquiry-program">Program interest</Label>
          <select
            id="enquiry-program"
            name="programInterest"
            defaultValue=""
            className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Any / not sure</option>
            {programOptions.map((p) => (
              <option key={p.slug} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
          <FieldError errors={fieldErrors} name="programInterest" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="enquiry-message">Message</Label>
          <Textarea id="enquiry-message" name="message" rows={3} required />
          <FieldError errors={fieldErrors} name="message" />
        </div>

        <SubmitButton label="Send Enquiry" />
      </form>
    </div>
  );
}
