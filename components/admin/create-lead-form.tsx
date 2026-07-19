"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createLeadManual } from "@/app/actions/admin-leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionResult } from "@/lib/validators";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "Saving…" : "Add walk-in lead"}
    </Button>
  );
}

export function CreateLeadForm({
  programs,
}: {
  programs: { id: string; name: string }[];
}) {
  const [state, action] = useFormState(createLeadManual, null as ActionResult | null);

  return (
    <details className="rounded-lg border bg-card p-4">
      <summary className="cursor-pointer font-medium">Add walk-in lead</summary>
      <form action={action} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1">
          <Label htmlFor="playerName">Player name</Label>
          <Input id="playerName" name="playerName" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="parentName">Parent name</Label>
          <Input id="parentName" name="parentName" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="playerAge">Age</Label>
          <Input id="playerAge" name="playerAge" type="number" min={4} max={80} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="programId">Program</Label>
          <select
            id="programId"
            name="programId"
            className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="">—</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor="message">Notes</Label>
          <Input id="message" name="message" />
        </div>
        <div className="flex items-end gap-3">
          <Submit />
          {state && (
            <p className={`text-sm ${state.ok ? "text-emerald-700" : "text-destructive"}`}>
              {state.message}
            </p>
          )}
        </div>
      </form>
    </details>
  );
}
