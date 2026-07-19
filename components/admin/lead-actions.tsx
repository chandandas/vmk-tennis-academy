"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/validators";

const STAGES = [
  "NEW",
  "CONTACTED",
  "TRIAL_SCHEDULED",
  "TRIAL_COMPLETED",
  "ENROLLED",
  "LOST",
] as const;

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "…" : label}
    </Button>
  );
}

type Props = {
  leadId: string;
  stage: string;
  hasStudent: boolean;
  coaches: { id: string; name: string }[];
  batches: { id: string; name: string }[];
  programs: { id: string; name: string }[];
  defaultProgramId: string | null;
  updateLeadStage: (
    leadId: string,
    stage: string,
    lostReason?: string
  ) => Promise<ActionResult>;
  scheduleTrial: (
    prev: ActionResult | null,
    formData: FormData
  ) => Promise<ActionResult>;
  convertLeadToStudent: (
    prev: ActionResult | null,
    formData: FormData
  ) => Promise<ActionResult>;
};

export function LeadActions({
  leadId,
  stage,
  hasStudent,
  coaches,
  batches,
  programs,
  defaultProgramId,
  updateLeadStage,
  scheduleTrial,
  convertLeadToStudent,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [trialState, trialAction] = useFormState(
    scheduleTrial,
    null as ActionResult | null
  );
  const [convertState, convertAction] = useFormState(
    convertLeadToStudent,
    null as ActionResult | null
  );

  return (
    <div className="space-y-4">
      <section className="rounded-lg border bg-card p-4">
        <h2 className="font-display text-lg font-semibold">Update stage</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {STAGES.map((s) => (
            <button
              key={s}
              type="button"
              disabled={pending || stage === s}
              className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                stage === s
                  ? "bg-vmk-green text-white"
                  : "bg-muted hover:bg-muted/80"
              }`}
              onClick={() => {
                const reason =
                  s === "LOST"
                    ? window.prompt("Lost reason?") ?? undefined
                    : undefined;
                startTransition(async () => {
                  await updateLeadStage(leadId, s, reason);
                });
              }}
            >
              {s.replaceAll("_", " ")}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-lg border bg-card p-4">
        <h2 className="font-display text-lg font-semibold">Schedule trial</h2>
        <form action={trialAction} className="mt-3 space-y-2">
          <input type="hidden" name="leadId" value={leadId} />
          <input
            type="datetime-local"
            name="scheduledAt"
            required
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
          <select
            name="coachId"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="">Coach (optional)</option>
            {coaches.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            name="batchId"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="">Batch (optional)</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <input
            name="notes"
            placeholder="Notes"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
          <Submit label="Schedule trial" />
          {trialState && (
            <p
              className={`text-sm ${trialState.ok ? "text-emerald-700" : "text-destructive"}`}
            >
              {trialState.message}
            </p>
          )}
        </form>
      </section>

      {!hasStudent && (
        <section className="rounded-lg border bg-card p-4">
          <h2 className="font-display text-lg font-semibold">
            Convert to student
          </h2>
          <form action={convertAction} className="mt-3 space-y-2">
            <input type="hidden" name="leadId" value={leadId} />
            <select
              name="programId"
              defaultValue={defaultProgramId ?? ""}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="">Program</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <select
              name="batchId"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="">Batch (optional)</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            <Submit label="Enrol student" />
            {convertState && (
              <p
                className={`text-sm ${convertState.ok ? "text-emerald-700" : "text-destructive"}`}
              >
                {convertState.message}
              </p>
            )}
          </form>
        </section>
      )}
    </div>
  );
}
