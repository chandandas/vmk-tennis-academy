"use client";

import { useMemo, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { upsertCoach } from "@/app/actions/admin-payments";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/validators";

export type CoachFormRow = {
  coaches: {
    id: string;
    name: string;
    slug: string;
    photoUrl: string | null;
    certifications: string | null;
    playingBackground: string | null;
    specialization: string | null;
    bio: string | null;
    isPublished: boolean;
    sortOrder: number;
  }[];
};

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-vmk-green text-white">
      {pending ? "Saving…" : "Save coach"}
    </Button>
  );
}

export function CoachForm({ coaches }: CoachFormProps) {
  const [selectedId, setSelectedId] = useState("");
  const [state, action] = useFormState(upsertCoach, null as ActionResult | null);

  const selected = useMemo(
    () => coaches.find((c) => c.id === selectedId) ?? null,
    [coaches, selectedId]
  );

  const key = selected?.id ?? "new";

  return (
    <details className="mb-8 rounded-lg border bg-card p-4" open>
      <summary className="cursor-pointer font-medium">Create / edit coach</summary>
      <form
        key={key}
        action={action}
        className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        <div className="space-y-1 lg:col-span-3">
          <label className="text-xs text-muted-foreground">
            Existing coach (blank = create)
          </label>
          <select
            name="id"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="">New coach</option>
            {coaches.map((c) => (
              <option key={c.id} value={c.id}>
                Edit: {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Name</label>
          <input
            name="name"
            required
            defaultValue={selected?.name ?? ""}
            className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Slug</label>
          <input
            name="slug"
            placeholder="auto from name"
            defaultValue={selected?.slug ?? ""}
            className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Photo URL</label>
          <input
            name="photoUrl"
            defaultValue={selected?.photoUrl ?? ""}
            placeholder="https://…"
            className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Role / specialization</label>
          <input
            name="specialization"
            defaultValue={selected?.specialization ?? ""}
            placeholder="e.g. Head Coach / Founder"
            className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Certifications</label>
          <input
            name="certifications"
            defaultValue={selected?.certifications ?? ""}
            className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Sort order</label>
          <input
            name="sortOrder"
            type="number"
            defaultValue={selected?.sortOrder ?? 0}
            className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>
        <div className="space-y-1 sm:col-span-2 lg:col-span-3">
          <label className="text-xs text-muted-foreground">Playing background</label>
          <input
            name="playingBackground"
            defaultValue={selected?.playingBackground ?? ""}
            className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>
        <div className="space-y-1 sm:col-span-2 lg:col-span-3">
          <label className="text-xs text-muted-foreground">Bio</label>
          <textarea
            name="bio"
            rows={3}
            defaultValue={selected?.bio ?? ""}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isPublished"
            value="true"
            defaultChecked={selected?.isPublished ?? false}
          />
          Published on site
        </label>
        <div className="flex flex-wrap items-center gap-3">
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
