import { CalendarDays, Phone } from "lucide-react";
import { CLINIC } from "@/lib/cms/defaults";

export function ActionBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-cream/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      role="navigation"
      aria-label="Quick contact"
    >
      <div className="grid grid-cols-3">
        <a
          href={`tel:${CLINIC.phonePrimary}`}
          className="flex flex-col items-center gap-1 py-3 text-[11px] font-semibold text-plum"
        >
          <Phone className="size-4" />
          Call
        </a>
        <a
          href={CLINIC.whatsappText}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 border-x border-border py-3 text-[11px] font-semibold text-teal"
        >
          <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.6.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.6-1.2a.6.6 0 0 0 0-.6c0-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4 5.3 5.3 0 0 0 3.3.7 2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.2-.3-.3-.5-.4z" />
          </svg>
          WhatsApp
        </a>
        <a href="/#booking" className="flex flex-col items-center gap-1 py-3 text-[11px] font-semibold text-plum">
          <CalendarDays className="size-4" />
          Book
        </a>
      </div>
    </div>
  );
}
