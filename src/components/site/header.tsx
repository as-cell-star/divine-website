import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { CLINIC } from "@/lib/cms/defaults";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/#services", label: "Services" },
  { href: "/#about", label: "About" },
  { href: "/#testimonials", label: "Reviews" },
  { href: "/#faq", label: "Questions" },
  { href: "/#contact", label: "Find us" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="bg-plum text-[12.5px] text-white/90">
        <p className="site-wrap flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2">
          <span>Open 24 hours · Kahawa Wendani</span>
          <a href={`tel:${CLINIC.phonePrimary}`} className="font-medium text-gold hover:text-white">
            {CLINIC.phonePrimaryDisplay}
          </a>
        </p>
      </div>
      <header className={cn("sticky top-0 z-50 border-b bg-paper/95 backdrop-blur-md", scrolled ? "border-border" : "border-transparent")}>
        <div className="site-wrap flex h-[4.25rem] items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/images/logo-emblem.png" alt="" width={40} height={40} className="size-10 object-contain" />
            <span className="leading-tight">
              <span className="block font-display text-[1.15rem] text-ink">Divine Birth</span>
              <span className="block text-[11px] text-ink-soft">Midwifery Centre</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-[14px] text-ink-mid hover:text-ink">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href={CLINIC.whatsappText}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-10 items-center rounded-full px-3 text-[13px] font-semibold text-ink-mid hover:text-ink sm:inline-flex"
            >
              WhatsApp
            </a>
            <a
              href="/#booking"
              className="inline-flex h-10 items-center rounded-full bg-teal px-4 text-[13px] font-semibold text-white hover:bg-teal-dark"
            >
              Book appointment
            </a>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>
      {open ? (
        <div className="fixed inset-x-0 top-[6.4rem] bottom-0 z-50 bg-paper lg:hidden">
          <nav className="site-wrap flex flex-col py-4">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="border-b border-border py-4 text-lg">
                {l.label}
              </a>
            ))}
            <a href="/#booking" onClick={() => setOpen(false)} className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-teal font-semibold text-white">
              Book a clinic visit
            </a>
          </nav>
        </div>
      ) : null}
    </>
  );
}
