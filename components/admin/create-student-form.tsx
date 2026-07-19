"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createStudent } from "@/app/actions/admin-students";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionResult } from "@/lib/validators";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "Saving…" : "Create student"}
    </Button>
  );
}

export function CreateStudentForm({
  programs,
  batches,
}: {
  programs: { id: string; name: string }[];
  batches: { id: string; name: string; programId: string }[];
}) {
  const [state, action] = useFormState(
    createStudent,
    null as ActionResult | null
  );

  return (
    <details className="rounded-lg border bg-card p-4">
      <summary className="cursor-pointer font-medium">Add student</summary>
      <form
        action={action}
        className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        <div className="space-y-1">
          <Label htmlFor="playerName">Player name</Label>
          <Input id="playerName" name="playerName" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="emergencyContact">Emergency contact</Label>
          <Input id="emergencyContact" name="emergencyContact" />
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
        <div className="space-y-1">
          <Label htmlFor="batchId">Batch</Label>
          <select
            id="batchId"
            name="batchId"
            className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="">—</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor="medicalNotes">Medical notes</Label>
          <Input id="medicalNotes" name="medicalNotes" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="guardianName">Guardian name</Label>
          <Input id="guardianName" name="guardianName" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="guardianPhone">Guardian phone</Label>
          <Input id="guardianPhone" name="guardianPhone" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="guardianEmail">Guardian email</Label>
          <Input id="guardianEmail" name="guardianEmail" type="email" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="guardianRelation">Relation</Label>
          <Input
            id="guardianRelation"
            name="guardianRelation"
            placeholder="parent"
          />
        </div>
        <div className="flex items-end gap-3 sm:col-span-2 lg:col-span-3">
          <Submit />
          {state && (
            <p
              className={`text-sm ${state.ok ? "text-emerald-700" : "text-destructive"}`}
            >
              {state.message}
            </p>
          )}
        </div>
      </form>
    </details>
  );
}
