"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin";
import type { ActionResult } from "@/lib/validators";
import { formDataToObject } from "@/lib/validators";

export async function updateStudentStatus(
  studentId: string,
  status: "ACTIVE" | "PAUSED" | "LEFT"
): Promise<ActionResult> {
  await requireAdminSession();
  await db.student.update({ where: { id: studentId }, data: { status } });
  revalidatePath("/admin/students");
  revalidatePath(`/admin/students/${studentId}`);
  return { ok: true, message: "Status updated" };
}

export async function updateStudentAssignment(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireAdminSession();
  const data = formDataToObject(formData);
  const studentId = data.studentId;
  if (!studentId) return { ok: false, message: "Missing student" };

  const programId = data.programId || null;
  const batchId = data.batchId || null;

  await db.student.update({
    where: { id: studentId },
    data: { programId, batchId },
  });

  if (programId) {
    await db.enrollment.updateMany({
      where: { studentId, isActive: true },
      data: { isActive: false, endDate: new Date() },
    });
    await db.enrollment.create({
      data: { studentId, programId, batchId, isActive: true },
    });
  }

  revalidatePath(`/admin/students/${studentId}`);
  revalidatePath("/admin/students");
  return { ok: true, message: "Assignment updated" };
}

export async function addProgressNote(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireAdminSession();
  const studentId = String(formData.get("studentId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!studentId || body.length < 2) {
    return { ok: false, message: "Note is required" };
  }
  await db.progressNote.create({
    data: { studentId, body, authorId: session.user!.id },
  });
  revalidatePath(`/admin/students/${studentId}`);
  return { ok: true, message: "Progress note added" };
}

export async function createStudent(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireAdminSession();
  const data = formDataToObject(formData);
  const playerName = data.playerName?.trim();
  if (!playerName) return { ok: false, message: "Player name is required" };

  await db.student.create({
    data: {
      playerName,
      phone: data.phone?.trim() || null,
      email: data.email?.trim() || null,
      emergencyContact: data.emergencyContact?.trim() || null,
      medicalNotes: data.medicalNotes?.trim() || null,
      programId: data.programId || null,
      batchId: data.batchId || null,
      status: "ACTIVE",
      guardians: data.guardianName
        ? {
            create: {
              name: data.guardianName.trim(),
              phone: data.guardianPhone?.trim() || data.phone?.trim() || "0000000000",
              email: data.guardianEmail?.trim() || null,
              relation: data.guardianRelation?.trim() || "parent",
            },
          }
        : undefined,
    },
  });
  revalidatePath("/admin/students");
  return { ok: true, message: "Student created" };
}
