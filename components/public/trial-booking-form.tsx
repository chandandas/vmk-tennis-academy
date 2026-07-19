"use client";

import { useFormState, useFormStatus } from "react-dom";
import { CheckCircle2 } from "lucide-react";
import { submitTrialBooking } from "@/app/actions/leads";
import type { ActionResult } from "@/lib/validators";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ProgramOption = { name: string; slug: string };

type TrialBookingFormProps = {
  programOptions: ProgramOption[];
  defaultProgram?: string;
  /** Unique prefix for field ids when the form appears more than once on a page */
  idPrefix?: string;
  /** When false, omit the page-anchor id (use inside modals) */
  showAnchor?: boolean;
  className?: string;
};

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

export function TrialBookingForm({
  programOptions,
  defaultProgram,
  idPrefix = "trial",
  showAnchor = true,
  className,
}: TrialBookingFormProps) {
  const [state, formAction] = useFormState<ActionResult | null, FormData>(
    submitTrialBooking,
    null
  );
  const pid = idPrefix;

  if (state?.ok) {
    return (
      <div
        id={showAnchor ? "book-trial" : undefined}
        className={cn(
          "scroll-mt-24 border border-vmk-lime bg-white p-6 sm:p-8",
          className
        )}
        role="status"
      >
        <CheckCircle2 className="size-10 text-vmk-green" aria-hidden />
        <h3 className="mt-3 font-display text-xl font-bold text-vmk-green">
          Trial request received
        </h3>
        <p className="mt-2 text-muted-foreground">{state.message}</p>
      </div>
    );
  }

  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;

  return (
    <div
      id={showAnchor ? "book-trial" : undefined}
      className={cn(
        "scroll-mt-24 border border-border bg-white p-6 sm:p-8",
        className
      )}
    >
      <h3 className="font-display text-xl font-bold text-vmk-green">
        Book a free trial class
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        We’ll confirm your slot within one business day.
      </p>

      {state && !state.ok && (
        <p className="mt-3 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
          {state.message}
        </p>
      )}

      <form action={formAction} className="relative mt-6 space-y-4" noValidate>
        <div className="pointer-events-none absolute -left-[9999px] opacity-0" aria-hidden>
          <label htmlFor={`${pid}-website`}>Website</label>
          <input
            id={`${pid}-website`}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`${pid}-parent`}>Parent name</Label>
            <Input id={`${pid}-parent`} name="parentName" required autoComplete="name" />
            <FieldError errors={fieldErrors} name="parentName" />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${pid}-player`}>Player name</Label>
            <Input id={`${pid}-player`} name="playerName" required />
            <FieldError errors={fieldErrors} name="playerName" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`${pid}-phone`}>Phone</Label>
            <Input
              id={`${pid}-phone`}
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
            <Label htmlFor={`${pid}-email`}>Email (optional)</Label>
            <Input id={`${pid}-email`} name="email" type="email" autoComplete="email" />
            <FieldError errors={fieldErrors} name="email" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`${pid}-age`}>Player age</Label>
            <Input
              id={`${pid}-age`}
              name="playerAge"
              type="number"
              min={4}
              max={80}
              required
            />
            <FieldError errors={fieldErrors} name="playerAge" />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${pid}-program`}>Program interest</Label>
            <select
              id={`${pid}-program`}
              name="programInterest"
              required
              defaultValue={defaultProgram ?? ""}
              className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="" disabled>
                Select program
              </option>
              {programOptions.map((p) => (
                <option key={p.slug} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
            <FieldError errors={fieldErrors} name="programInterest" />
          </div>
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Preferred slot</legend>
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="preferredSlot"
                value="MORNING"
                defaultChecked
              />
              Morning
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="preferredSlot" value="EVENING" />
              Evening
            </label>
          </div>
          <FieldError errors={fieldErrors} name="preferredSlot" />
        </fieldset>

        <div className="space-y-2">
          <Label htmlFor={`${pid}-message`}>Message (optional)</Label>
          <Textarea id={`${pid}-message`} name="message" rows={3} />
          <FieldError errors={fieldErrors} name="message" />
        </div>

        <SubmitButton label="Book Free Trial" />
      </form>
    </div>
  );
}
