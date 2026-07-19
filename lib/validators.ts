import { z } from "zod";

/** Shared Zod schemas for forms + server actions */

export const indianPhoneSchema = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number");

export const timeSlotSchema = z.enum(["MORNING", "EVENING"]);

const optionalEmail = z
  .string()
  .trim()
  .transform((v) => (v === "" ? undefined : v))
  .pipe(z.string().email("Invalid email").optional());

/** Honeypot — bots fill this; humans leave empty */
const honeypot = z
  .string()
  .optional()
  .transform((v) => v ?? "")
  .refine((v) => v.length === 0, { message: "Spam detected" });

export const trialBookingSchema = z.object({
  parentName: z.string().trim().min(2, "Parent name is required").max(100),
  playerName: z.string().trim().min(2, "Player name is required").max(100),
  phone: indianPhoneSchema,
  email: optionalEmail,
  playerAge: z.coerce.number().int().min(4, "Age must be at least 4").max(80),
  programInterest: z.string().trim().min(1, "Select a program"),
  preferredSlot: timeSlotSchema,
  message: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  website: honeypot,
});

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  phone: indianPhoneSchema,
  email: optionalEmail,
  programInterest: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  message: z.string().trim().min(5, "Message is required").max(1000),
  website: honeypot,
});

export type TrialBookingInput = z.infer<typeof trialBookingSchema>;
export type EnquiryInput = z.infer<typeof enquirySchema>;

export type ActionResult =
  | { ok: true; message: string }
  | {
      ok: false;
      message: string;
      fieldErrors?: Record<string, string[]>;
    };

export function formDataToObject(formData: FormData): Record<string, string> {
  const obj: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (typeof value === "string") {
      obj[key] = value;
    }
  });
  return obj;
}

/** Adapt server actions that return ActionResult for HTML form `action` (must return void). */
export function asFormAction(
  action: (formData: FormData) => Promise<unknown>
): (formData: FormData) => Promise<void> {
  return async (formData) => {
    await action(formData);
  };
}

/** For (prev, formData) server actions used directly on forms. */
export function asStatefulFormAction(
  action: (
    prev: ActionResult | null,
    formData: FormData
  ) => Promise<ActionResult | void>
): (formData: FormData) => Promise<void> {
  return async (formData) => {
    await action(null, formData);
  };
}
