"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin";
import type { ActionResult } from "@/lib/validators";
import { formDataToObject } from "@/lib/validators";
import bcrypt from "bcryptjs";

export async function upsertFaq(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireAdminSession(["ADMIN"]);
  const data = formDataToObject(formData);
  const question = data.question?.trim();
  const answer = data.answer?.trim();
  if (!question || !answer) {
    return { ok: false, message: "Question and answer are required" };
  }
  const payload = {
    question,
    answer,
    isPublished: data.isPublished !== "false",
    sortOrder: data.sortOrder ? Number(data.sortOrder) : 0,
  };
  if (data.id) {
    await db.faq.update({ where: { id: data.id }, data: payload });
  } else {
    await db.faq.create({ data: payload });
  }
  revalidatePath("/admin/content");
  revalidatePath("/");
  revalidatePath("/faq");
  return { ok: true, message: "FAQ saved" };
}

export async function deleteFaq(id: string) {
  await requireAdminSession(["ADMIN"]);
  await db.faq.delete({ where: { id } });
  revalidatePath("/admin/content");
  revalidatePath("/");
  revalidatePath("/faq");
}

export async function upsertTestimonial(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireAdminSession(["ADMIN"]);
  const data = formDataToObject(formData);
  const studentName = data.studentName?.trim();
  const quote = data.quote?.trim();
  if (!studentName || !quote) {
    return { ok: false, message: "Name and quote are required" };
  }
  const payload = {
    studentName,
    quote,
    achievement: data.achievement?.trim() || null,
    parentName: data.parentName?.trim() || null,
    photoUrl: data.photoUrl?.trim() || null,
    isPublished: data.isPublished === "on" || data.isPublished === "true",
    sortOrder: data.sortOrder ? Number(data.sortOrder) : 0,
  };
  if (data.id) {
    await db.testimonial.update({ where: { id: data.id }, data: payload });
  } else {
    await db.testimonial.create({ data: payload });
  }
  revalidatePath("/admin/content");
  revalidatePath("/");
  return { ok: true, message: "Testimonial saved" };
}

export async function toggleTestimonialPublished(
  id: string,
  isPublished: boolean
) {
  await requireAdminSession(["ADMIN"]);
  await db.testimonial.update({ where: { id }, data: { isPublished } });
  revalidatePath("/admin/content");
  revalidatePath("/");
}

export async function upsertGalleryItem(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireAdminSession(["ADMIN"]);
  const data = formDataToObject(formData);
  const imageUrl = data.imageUrl?.trim();
  if (!imageUrl) return { ok: false, message: "Image URL is required" };

  const category = (
    data.category === "TOURNAMENTS" ||
    data.category === "EVENTS" ||
    data.category === "FACILITIES"
      ? data.category
      : "TRAINING"
  ) as "TRAINING" | "TOURNAMENTS" | "EVENTS" | "FACILITIES";

  const payload = {
    title: data.title?.trim() || null,
    imageUrl,
    altText: data.altText?.trim() || null,
    category,
    isPublished: data.isPublished === "on" || data.isPublished === "true",
    sortOrder: data.sortOrder ? Number(data.sortOrder) : 0,
  };

  if (data.id) {
    await db.galleryItem.update({ where: { id: data.id }, data: payload });
  } else {
    await db.galleryItem.create({ data: payload });
  }
  revalidatePath("/admin/content");
  revalidatePath("/");
  return { ok: true, message: "Gallery item saved" };
}

export async function saveSiteSetting(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireAdminSession(["ADMIN"]);
  const key = String(formData.get("key") ?? "").trim();
  const value = String(formData.get("value") ?? "");
  if (!key) return { ok: false, message: "Key required" };

  await db.siteSetting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
  revalidatePath("/admin/settings");
  revalidatePath("/admin/content");
  revalidatePath("/");
  return { ok: true, message: "Setting saved" };
}

export async function createStaffUser(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireAdminSession(["ADMIN"]);
  const data = formDataToObject(formData);
  const email = data.email?.trim().toLowerCase();
  const name = data.name?.trim();
  const password = data.password ?? "";
  const role =
    data.role === "COACH" || data.role === "FRONT_DESK" ? data.role : "ADMIN";

  if (!email || !name || password.length < 8) {
    return {
      ok: false,
      message: "Name, email, and password (8+) are required",
    };
  }

  const exists = await db.user.findUnique({ where: { email } });
  if (exists) return { ok: false, message: "Email already in use" };

  await db.user.create({
    data: {
      email,
      name,
      role,
      phone: data.phone?.trim() || null,
      passwordHash: await bcrypt.hash(password, 12),
      isActive: true,
    },
  });
  revalidatePath("/admin/settings");
  return { ok: true, message: "User created" };
}

export async function toggleUserActive(userId: string, isActive: boolean) {
  await requireAdminSession(["ADMIN"]);
  await db.user.update({ where: { id: userId }, data: { isActive } });
  revalidatePath("/admin/settings");
}
