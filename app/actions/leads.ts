"use server";

import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { getSiteSettings } from "@/lib/site-content";
import {
  enquirySchema,
  formDataToObject,
  trialBookingSchema,
  type ActionResult,
} from "@/lib/validators";

function fieldErrorsFromZod(
  error: { flatten: () => { fieldErrors: Record<string, string[] | undefined> } }
): Record<string, string[]> {
  const flat = error.flatten().fieldErrors;
  const out: Record<string, string[]> = {};
  for (const [key, messages] of Object.entries(flat)) {
    if (messages && messages.length > 0) {
      out[key] = messages;
    }
  }
  return out;
}

async function resolveProgramId(programInterest?: string) {
  if (!programInterest) return null;
  const program = await db.program.findFirst({
    where: {
      OR: [
        { name: { equals: programInterest } },
        { slug: { equals: programInterest.toLowerCase().replace(/\s+/g, "-") } },
      ],
      isPublished: true,
    },
    select: { id: true },
  });
  return program?.id ?? null;
}

async function notifyAdmin(opts: {
  subject: string;
  lines: string[];
}) {
  const settings = await getSiteSettings();
  const recipients =
    settings.notificationEmails.length > 0
      ? settings.notificationEmails
      : [settings.email];

  const text = opts.lines.join("\n");
  const html = `<div style="font-family:sans-serif;line-height:1.5">
    <h2 style="color:#0B3D2E">${opts.subject}</h2>
    <pre style="white-space:pre-wrap;font-family:inherit">${text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")}</pre>
  </div>`;

  await sendEmail({
    to: recipients,
    subject: opts.subject,
    html,
    text,
  });
}

export async function submitTrialBooking(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const ip = getClientIp();
  const limited = checkRateLimit(`trial:${ip}`);
  if (!limited.ok) {
    return {
      ok: false,
      message: `Too many requests. Try again in ${limited.retryAfterSec}s.`,
    };
  }

  const raw = formDataToObject(formData);

  // Honeypot: pretend success so bots don't retry
  if (raw.website && raw.website.length > 0) {
    return {
      ok: true,
      message: "Thanks! We’ll contact you shortly to confirm your trial.",
    };
  }

  const parsed = trialBookingSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: fieldErrorsFromZod(parsed.error),
    };
  }

  const data = parsed.data;
  const programId = await resolveProgramId(data.programInterest);

  const lead = await db.lead.create({
    data: {
      parentName: data.parentName,
      playerName: data.playerName,
      phone: data.phone,
      email: data.email,
      playerAge: data.playerAge,
      programInterest: data.programInterest,
      preferredSlot: data.preferredSlot,
      message: data.message,
      source: "TRIAL_BOOKING",
      stage: "NEW",
      programId,
    },
  });

  await notifyAdmin({
    subject: `[VMKTA] New trial booking — ${data.playerName}`,
    lines: [
      `Lead ID: ${lead.id}`,
      `Source: Trial booking`,
      `Parent: ${data.parentName}`,
      `Player: ${data.playerName}`,
      `Age: ${data.playerAge}`,
      `Phone: ${data.phone}`,
      `Email: ${data.email ?? "—"}`,
      `Program: ${data.programInterest}`,
      `Preferred slot: ${data.preferredSlot}`,
      `Message: ${data.message ?? "—"}`,
    ],
  });

  return {
    ok: true,
    message: "Thanks! We’ll contact you shortly to confirm your trial.",
  };
}

export async function submitEnquiry(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const ip = getClientIp();
  const limited = checkRateLimit(`enquiry:${ip}`);
  if (!limited.ok) {
    return {
      ok: false,
      message: `Too many requests. Try again in ${limited.retryAfterSec}s.`,
    };
  }

  const raw = formDataToObject(formData);

  if (raw.website && raw.website.length > 0) {
    return {
      ok: true,
      message: "Thanks for reaching out — we’ll get back to you soon.",
    };
  }

  const parsed = enquirySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: fieldErrorsFromZod(parsed.error),
    };
  }

  const data = parsed.data;
  const programId = await resolveProgramId(data.programInterest);

  const lead = await db.lead.create({
    data: {
      playerName: data.name,
      parentName: data.name,
      phone: data.phone,
      email: data.email,
      programInterest: data.programInterest,
      message: data.message,
      source: "ENQUIRY",
      stage: "NEW",
      programId,
    },
  });

  await notifyAdmin({
    subject: `[VMKTA] New enquiry — ${data.name}`,
    lines: [
      `Lead ID: ${lead.id}`,
      `Source: Enquiry`,
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      `Email: ${data.email ?? "—"}`,
      `Program: ${data.programInterest ?? "—"}`,
      `Message: ${data.message}`,
    ],
  });

  return {
    ok: true,
    message: "Thanks for reaching out — we’ll get back to you soon.",
  };
}
