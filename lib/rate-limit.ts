import "server-only";
import { headers } from "next/headers";

type Bucket = { timestamps: number[] };

const store = new Map<string, Bucket>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 5;

function prune(bucket: Bucket, now: number) {
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < WINDOW_MS);
}

/**
 * Basic in-memory rate limit (per serverless instance).
 * Good enough for v1 spam control; swap for Redis/Upstash later.
 */
export function checkRateLimit(
  key: string,
  max = MAX_REQUESTS,
  windowMs = WINDOW_MS
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  const bucket = store.get(key) ?? { timestamps: [] };
  prune(bucket, now);

  if (bucket.timestamps.length >= max) {
    const oldest = bucket.timestamps[0] ?? now;
    const retryAfterSec = Math.ceil((windowMs - (now - oldest)) / 1000);
    store.set(key, bucket);
    return { ok: false, retryAfterSec: Math.max(retryAfterSec, 1) };
  }

  bucket.timestamps.push(now);
  store.set(key, bucket);
  return { ok: true };
}

export function getClientIp(): string {
  const h = headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return h.get("x-real-ip") ?? h.get("cf-connecting-ip") ?? "unknown";
}
