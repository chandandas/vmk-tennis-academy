/**
 * Email service abstraction.
 * Dev: logs to console. Prod: set EMAIL_PROVIDER=resend + RESEND_API_KEY.
 */

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
};

export async function sendEmail(input: SendEmailInput): Promise<{ ok: boolean }> {
  const from =
    input.from ??
    process.env.EMAIL_FROM ??
    "VMK Tennis Academy <noreply@vmkta.com>";
  const to = Array.isArray(input.to) ? input.to : [input.to];

  if (process.env.EMAIL_PROVIDER === "resend" && process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to,
          subject: input.subject,
          html: input.html,
          text: input.text,
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        console.error("[email:resend] Failed:", res.status, body);
        return { ok: false };
      }

      return { ok: true };
    } catch (err) {
      console.error("[email:resend] Error:", err);
      return { ok: false };
    }
  }

  console.info("[email:dev]", {
    from,
    to,
    subject: input.subject,
    text: input.text ?? input.html.replace(/<[^>]+>/g, " ").slice(0, 280),
  });

  return { ok: true };
}
