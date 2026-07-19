"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin";
import type { ActionResult } from "@/lib/validators";
import { formDataToObject } from "@/lib/validators";

const stageSchema = z.enum([
  "NEW",
  "CONTACTED",
  "TRIAL_SCHEDULED",
  "TRIAL_COMPLETED",
  "ENROLLED",
  "LOST",
]);

export async function updateLeadStage(
  leadId: string,
  stage: string,
  lostReason?: string
): Promise<ActionResult> {
  await requireAdminSession();
  const parsed = stageSchema.safeParse(stage);
  if (!parsed.success) return { ok: false, message: "Invalid stage" };

  await db.lead.update({
    where: { id: leadId },
    data: {
      stage: parsed.data,
      lostReason:
        parsed.data === "LOST" ? lostReason?.trim() || "Not specified" : null,
    },
  });
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin");
  return { ok: true, message: "Stage updated" };
}

export async function addLeadNote(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireAdminSession();
  const leadId = String(formData.get("leadId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!leadId || body.length < 2) {
    return { ok: false, message: "Note is required" };
  }
  await db.leadNote.create({
    data: { leadId, body, authorId: session.user!.id },
  });
  revalidatePath(`/admin/leads/${leadId}`);
  return { ok: true, message: "Note added" };
}

export async function addFollowUp(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireAdminSession();
  const leadId = String(formData.get("leadId") ?? "");
  const dueAt = String(formData.get("dueAt") ?? "");
  const note = String(formData.get("note") ?? "").trim() || null;
  if (!leadId || !dueAt) {
    return { ok: false, message: "Due date is required" };
  }
  await db.followUp.create({
    data: {
      leadId,
      dueAt: new Date(dueAt),
      note,
      assignedToId: session.user!.id,
    },
  });
  revalidatePath(`/admin/leads/${leadId}`);
  return { ok: true, message: "Follow-up scheduled" };
}

export async function completeFollowUp(followUpId: string, leadId: string) {
  await requireAdminSession();
  await db.followUp.update({
    where: { id: followUpId },
    data: { completedAt: new Date() },
  });
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function scheduleTrial(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireAdminSession();
  const leadId = String(formData.get("leadId") ?? "");
  const scheduledAt = String(formData.get("scheduledAt") ?? "");
  const coachId = String(formData.get("coachId") ?? "") || null;
  const batchId = String(formData.get("batchId") ?? "") || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!leadId || !scheduledAt) {
    return { ok: false, message: "Date/time is required" };
  }

  await db.trialAppointment.create({
    data: {
      leadId,
      scheduledAt: new Date(scheduledAt),
      coachId,
      batchId,
      notes,
    },
  });
  await db.lead.update({
    where: { id: leadId },
    data: { stage: "TRIAL_SCHEDULED" },
  });
  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return { ok: true, message: "Trial scheduled" };
}

export async function convertLeadToStudent(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireAdminSession();
  const data = formDataToObject(formData);
  const leadId = data.leadId;
  if (!leadId) return { ok: false, message: "Missing lead" };

  const lead = await db.lead.findUnique({ where: { id: leadId } });
  if (!lead) return { ok: false, message: "Lead not found" };

  const existing = await db.student.findUnique({ where: { leadId } });
  if (existing) {
    return { ok: false, message: "Already converted to a student" };
  }

  const programId = data.programId || lead.programId || null;
  const batchId = data.batchId || null;

  const student = await db.student.create({
    data: {
      leadId,
      playerName: lead.playerName,
      phone: lead.phone,
      email: lead.email,
      programId,
      batchId,
      status: "ACTIVE",
      guardians: lead.parentName
        ? {
            create: {
              name: lead.parentName,
              phone: lead.phone,
              email: lead.email,
              relation: "parent",
            },
          }
        : undefined,
      enrollments:
        programId != null
          ? {
              create: {
                programId,
                batchId,
                isActive: true,
              },
            }
          : undefined,
    },
  });

  await db.lead.update({
    where: { id: leadId },
    data: { stage: "ENROLLED" },
  });

  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/leads");
  revalidatePath("/admin/students");
  revalidatePath("/admin");
  return {
    ok: true,
    message: `Enrolled as student (${student.playerName})`,
  };
}

export async function createLeadManual(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireAdminSession();
  const data = formDataToObject(formData);
  const playerName = data.playerName?.trim();
  const phone = data.phone?.trim();
  if (!playerName || !phone) {
    return { ok: false, message: "Player name and phone are required" };
  }

  await db.lead.create({
    data: {
      playerName,
      phone,
      parentName: data.parentName?.trim() || null,
      email: data.email?.trim() || null,
      playerAge: data.playerAge ? Number(data.playerAge) : null,
      programInterest: data.programInterest?.trim() || null,
      preferredSlot:
        data.preferredSlot === "MORNING" || data.preferredSlot === "EVENING"
          ? data.preferredSlot
          : null,
      message: data.message?.trim() || null,
      source: "WALK_IN",
      stage: "NEW",
      programId: data.programId || null,
    },
  });
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return { ok: true, message: "Lead created" };
}
