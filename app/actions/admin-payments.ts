"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin";
import type { ActionResult } from "@/lib/validators";
import { formDataToObject } from "@/lib/validators";

function receiptNo() {
  const n = Date.now().toString(36).toUpperCase();
  return `VMK-${n}`;
}

export async function recordPayment(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireAdminSession();
  const data = formDataToObject(formData);
  const studentId = data.studentId;
  const amountInr = Number(data.amountInr);
  if (!studentId || !amountInr || amountInr <= 0) {
    return { ok: false, message: "Student and amount are required" };
  }

  const method =
    data.method === "UPI" || data.method === "BANK" ? data.method : "CASH";
  const status =
    data.status === "PENDING" ||
    data.status === "OVERDUE" ||
    data.status === "CANCELLED"
      ? data.status
      : "PAID";

  await db.payment.create({
    data: {
      studentId,
      feePlanId: data.feePlanId || null,
      amountInr,
      method,
      status,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      paidAt: status === "PAID" ? new Date() : null,
      receiptNo: status === "PAID" ? receiptNo() : null,
      notes: data.notes?.trim() || null,
    },
  });

  revalidatePath("/admin/payments");
  revalidatePath(`/admin/students/${studentId}`);
  revalidatePath("/admin");
  revalidatePath("/admin/reports");
  return { ok: true, message: "Payment recorded" };
}

export async function markPaymentPaid(paymentId: string): Promise<ActionResult> {
  await requireAdminSession();
  await db.payment.update({
    where: { id: paymentId },
    data: {
      status: "PAID",
      paidAt: new Date(),
      receiptNo: receiptNo(),
    },
  });
  revalidatePath("/admin/payments");
  revalidatePath("/admin");
  return { ok: true, message: "Marked paid" };
}

export async function upsertCoach(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireAdminSession(["ADMIN"]);
  const data = formDataToObject(formData);
  const name = data.name?.trim();
  const slug =
    data.slug?.trim() ||
    name
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  if (!name || !slug) {
    return { ok: false, message: "Name is required" };
  }

  const payload = {
    name,
    slug,
    photoUrl: data.photoUrl?.trim() || null,
    certifications: data.certifications?.trim() || null,
    playingBackground: data.playingBackground?.trim() || null,
    specialization: data.specialization?.trim() || null,
    bio: data.bio?.trim() || null,
    isPublished: data.isPublished === "on" || data.isPublished === "true",
    sortOrder: data.sortOrder ? Number(data.sortOrder) : 0,
  };

  if (data.id) {
    await db.coach.update({ where: { id: data.id }, data: payload });
  } else {
    await db.coach.create({ data: payload });
  }

  revalidatePath("/admin/coaches");
  revalidatePath("/");
  return { ok: true, message: data.id ? "Coach updated" : "Coach created" };
}

export async function toggleCoachPublished(coachId: string, isPublished: boolean) {
  await requireAdminSession(["ADMIN"]);
  await db.coach.update({ where: { id: coachId }, data: { isPublished } });
  revalidatePath("/admin/coaches");
  revalidatePath("/");
}
