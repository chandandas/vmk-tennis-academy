import { MessageCircle } from "lucide-react";
import { whatsappHref } from "@/lib/site";

type WhatsAppFloatProps = {
  phone: string;
  academyName: string;
};

export function WhatsAppFloat({ phone, academyName }: WhatsAppFloatProps) {
  return (
    <a
      href={whatsappHref(
        phone,
        `Hi ${academyName}, I'd like to know more about your programs.`
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vmk-green"
    >
      <MessageCircle className="size-7" fill="currentColor" />
    </a>
  );
}
