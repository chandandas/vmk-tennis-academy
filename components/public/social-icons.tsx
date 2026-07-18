import { whatsappHref, type SiteSocial } from "@/lib/site";

const iconClass = "size-[15px]";

function InstagramIcon({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9C2.4 3.9 4 2.4 7.1 2.3 8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-2.2.1-3.3 1.2-3.4 3.4-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 2.2 1.2 3.3 3.4 3.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c2.2-.1 3.3-1.2 3.4-3.4.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-2.2-1.2-3.3-3.4-3.4-1.2-.1-1.6-.1-4.7-.1zm0 3.1a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4zm5.1-.9a1.2 1.2 0 1 1 0 2.3 1.2 1.2 0 0 1 0-2.3z" />
    </svg>
  );
}

function YoutubeIcon({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.8 15.5v-7l6.3 3.5-6.3 3.5z" />
    </svg>
  );
}

function FacebookIcon({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14C17.17 2.1 15.8 2 14.5 2 11.6 2 9.5 3.79 9.5 7.15V9.5H7v4h2.5V22h4v-8.5z" />
    </svg>
  );
}

function WhatsAppIcon({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.5 3.5A11 11 0 0 0 2.1 17.2L1 23l5.9-1.1A11 11 0 1 0 20.5 3.5zM12 20.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3.5.7.7-3.4-.2-.3a8.2 8.2 0 1 1 7.5 4.3zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.7.9-.1.2-.3.2-.5.1-.2-.1-.9-.3-1.7-1.1-.6-.6-1.1-1.3-1.2-1.5-.1-.2 0-.3.1-.4l.4-.4c.1-.1.2-.3.2-.4 0-.1 0-.3-.1-.4-.1-.1-.5-1.3-.7-1.7-.2-.5-.4-.4-.5-.4h-.4c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.5 3.9 3.4.5.2 1 .4 1.3.5.6.2 1.1.2 1.5.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3z" />
    </svg>
  );
}

const socialBtn =
  "inline-flex size-7 items-center justify-center rounded-full bg-white/10 text-white transition hover:scale-110 hover:bg-vmk-lime hover:text-vmk-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vmk-lime";

type TopSocialLinksProps = {
  social: SiteSocial;
  whatsapp: string;
};

export function TopSocialLinks({ social, whatsapp }: TopSocialLinksProps) {
  return (
    <div className="flex items-center gap-1.5">
      {social.instagram && (
        <a
          href={social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className={socialBtn}
        >
          <InstagramIcon />
        </a>
      )}
      {social.youtube && (
        <a
          href={social.youtube}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
          className={socialBtn}
        >
          <YoutubeIcon />
        </a>
      )}
      {social.facebook && (
        <a
          href={social.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className={socialBtn}
        >
          <FacebookIcon />
        </a>
      )}
      <a
        href={whatsappHref(whatsapp)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className={socialBtn}
      >
        <WhatsAppIcon />
      </a>
    </div>
  );
}
