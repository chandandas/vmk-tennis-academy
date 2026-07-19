"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin";
import type { ActionResult } from "@/lib/validators";
import { formDataToObject } from "@/lib/validators";

export async function upsertBatch(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireAdminSession();
  const data = formDataToObject(formData);
  const name = data.name?.trim();
  const programId = data.programId;
  const startTime = data.startTime?.trim();
  const endTime = data.endTime?.trim();
  const timeSlot =
    data.timeSlot === "EVENING" ? "EVENING" : "MORNING";

  if (!name || !programId || !startTime || !endTime) {
    return { ok: false, message: "Name, program, and times are required" };
  }

  const days = (data.daysOfWeek || "MON,WED,FRI")
    .split(",")
    .map((d) => d.trim().toUpperCase())
    .filter(Boolean);

  const payload = {
    name,
    programId,
    coachId: data.coachId || null,
    daysOfWeek: JSON.stringify(days),
    timeSlot: timeSlot as "MORNING" | "EVENING",
    startTime,
    endTime,
    court: data.court?.trim() || null,
    capacity: data.capacity ? Number(data.capacity) : 8,
    isActive: data.isActive !== "false",
  };

  if (data.id) {
    await db.batch.update({ where: { id: data.id }, data: payload });
  } else {
    await db.batch.create({ data: payload });
  }

  revalidatePath("/admin/batches");
  revalidatePath("/admin/attendance");
  return { ok: true, message: data.id ? "Batch updated" : "Batch created" };
}

export async function toggleBatchActive(batchId: string, isActive: boolean) {
  await requireAdminSession();
  await db.batch.update({ where: { id: batchId }, data: { isActive } });
  revalidatePath("/admin/batches");
}

export async function markAttendance(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireAdminSession();
  const batchId = String(formData.get("batchId") ?? "");
  const dateStr = String(formData.get("date") ?? "");
  if (!batchId || !dateStr) {
    return { ok: false, message: "Batch and date are required" };
  }

  const date = new Date(`${dateStr}T00:00:00.000Z`);
  const studentIds = formData.getAll("studentId").map(String);

  for (const studentId of studentIds) {
    const present = formData.get(`present_${studentId}`) === "on";
    await db.attendanceRecord.upsert({
      where: {
        studentId_batchId_date: { studentId, batchId, date },
      },
      create: {
        studentId,
        batchId,
        date,
        present,
        markedById: session.user!.id,
      },
      update: {
        present,
        markedById: session.user!.id,
      },
    });
  }

  revalidatePath("/admin/attendance");
  revalidatePath("/admin/reports");
  return { ok: true, message: `Attendance saved for ${studentIds.length} students` };
}
